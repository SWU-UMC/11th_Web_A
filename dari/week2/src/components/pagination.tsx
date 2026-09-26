interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      <button
        className="pagination__button"
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img
          src="/icons/movie-icons/chevron-left.svg"
          alt=""
          aria-hidden="true"
        />
      </button>

      <span className="pagination__page" aria-current="page">
        {currentPage}
      </span>

      <button
        className="pagination__button"
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img
          src="/icons/movie-icons/chevron-right.svg"
          alt=""
          aria-hidden="true"
        />
      </button>
    </nav>
  )
}