interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}

export default function Pagination({
  page,
  pageCount,
  onChange,
  disabled = false,
}: PaginationProps) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="button"
        onClick={() => onChange(page - 1)}
        disabled={disabled || page <= 1}
      >
        ‹ Prev
      </button>
      <span className="pagination__info">
        Page {page} of {pageCount}
      </span>
      <button
        type="button"
        className="button"
        onClick={() => onChange(page + 1)}
        disabled={disabled || page >= pageCount}
      >
        Next ›
      </button>
    </nav>
  );
}
