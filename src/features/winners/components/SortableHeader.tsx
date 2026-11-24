import type { SortField, SortOrder } from '../../../types';

interface SortableHeaderProps {
  field: SortField;
  label: string;
  sort: SortField;
  order: SortOrder;
  onSort: (field: SortField) => void;
}

const ARIA_SORT: Record<SortOrder, 'ascending' | 'descending'> = {
  ASC: 'ascending',
  DESC: 'descending',
};

const ARROWS: Record<SortOrder, string> = { ASC: '▲', DESC: '▼' };

export default function SortableHeader({ field, label, sort, order, onSort }: SortableHeaderProps) {
  const isActive = field === sort;

  return (
    <th aria-sort={isActive ? ARIA_SORT[order] : 'none'}>
      <button type="button" className="table__sort" onClick={() => onSort(field)}>
        {label}
        <span className="table__arrow">{isActive ? ARROWS[order] : '↕'}</span>
      </button>
    </th>
  );
}
