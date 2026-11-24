import ErrorMessage from '../../components/ErrorMessage';
import Pagination from '../../components/Pagination';
import WinnersTable from './components/WinnersTable';
import useWinners from './hooks/useWinners';
import './winners.css';

export default function WinnersPage() {
  const {
    rows,
    total,
    page,
    pageCount,
    sort,
    order,
    firstRowNumber,
    isLoading,
    error,
    changePage,
    changeSort,
    retry,
  } = useWinners();

  const hasRows = rows.length > 0;

  return (
    <section className="view">
      <h1 className="view__title">
        Winners <span className="view__count">({total})</span>
      </h1>

      {error && <ErrorMessage message={error} onRetry={retry} />}

      {hasRows ? (
        <WinnersTable
          rows={rows}
          firstRowNumber={firstRowNumber}
          sort={sort}
          order={order}
          onSort={changeSort}
        />
      ) : (
        <p className="empty-state">
          {isLoading ? 'Loading winners…' : 'No winners yet. Start a race in the garage!'}
        </p>
      )}

      <Pagination page={page} pageCount={pageCount} onChange={changePage} disabled={isLoading} />
    </section>
  );
}
