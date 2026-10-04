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
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="영화 목록 페이지">
      <button
        className="grid size-[34px] place-items-center rounded-md border border-gray-300 bg-white disabled:cursor-not-allowed disabled:opacity-40"
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

      <span className="grid size-[34px] place-items-center rounded-md bg-blue-600 text-sm font-bold text-white" aria-current="page">
        {currentPage}
      </span>

      <button
        className="grid size-[34px] place-items-center rounded-md border border-gray-300 bg-white disabled:cursor-not-allowed disabled:opacity-40"
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
