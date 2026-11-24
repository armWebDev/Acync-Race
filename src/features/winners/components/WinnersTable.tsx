import CarIcon from '../../../components/CarIcon';
import type { SortField, SortOrder, WinnerRow } from '../../../types';
import { formatSeconds } from '../../../utils/format';
import SortableHeader from './SortableHeader';

interface WinnersTableProps {
  rows: WinnerRow[];
  firstRowNumber: number;
  sort: SortField;
  order: SortOrder;
  onSort: (field: SortField) => void;
}

const SORTABLE_COLUMNS: { field: SortField; label: string }[] = [
  { field: 'wins', label: 'Wins' },
  { field: 'time', label: 'Best time' },
];

function WinnerTableRow({ winner, number }: { winner: WinnerRow; number: number }) {
  return (
    <tr>
      <td>{number}</td>
      <td>
        <CarIcon color={winner.color} className="table__car" />
      </td>
      <td>{winner.name}</td>
      <td>{winner.wins}</td>
      <td>{formatSeconds(winner.time)}</td>
    </tr>
  );
}

export default function WinnersTable({
  rows,
  firstRowNumber,
  sort,
  order,
  onSort,
}: WinnersTableProps) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>№</th>
            <th>Car</th>
            <th>Name</th>
            {SORTABLE_COLUMNS.map(({ field, label }) => (
              <SortableHeader
                key={field}
                field={field}
                label={label}
                sort={sort}
                order={order}
                onSort={onSort}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((winner, index) => (
            <WinnerTableRow key={winner.id} winner={winner} number={firstRowNumber + index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
