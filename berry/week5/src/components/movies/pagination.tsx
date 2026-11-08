import { cn } from "../../utils/cn.ts";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const lastPage = Math.max(totalPages, 1);
  const firstVisiblePage = Math.floor((currentPage - 1) / 5) * 5 + 1;
  const visiblePages = Array.from(
    { length: Math.min(5, lastPage - firstVisiblePage + 1) },
    (_, index) => firstVisiblePage + index,
  );

  return (
    <nav
      className="flex justify-center items-center gap-2 mt-8 mb-12"
      aria-label="영화 목록 페이지"
    >
      <button
        type="button"
        className={cn(
          "px-3 py-2 text-sm font-medium opacity-70 text-gray-600 transition-colors hover:text-black",
          currentPage === 1 &&
            "opacity-20 cursor-not-allowed hover:text-gray-600",
        )}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <img src="../../../public/icons/chevron-left.svg" alt="이전 페이지" />
      </button>
      {visiblePages.map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            "px-3 py-2 text-sm font-medium transition-colors rounded",
            page === currentPage
              ? "bg-black text-white font-bold"
              : "text-gray-500 hover:text-black",
          )}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={`${page}페이지`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        className={cn(
          "px-3 py-2 text-sm font-medium opacity-70 text-gray-600 transition-colors hover:text-black",
          currentPage === lastPage &&
            "opacity-20 cursor-not-allowed hover:text-gray-600",
        )}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        aria-label="다음 페이지"
      >
        <img src="../../../public/icons/chevron-right.svg" alt="다음 페이지" />
      </button>
    </nav>
  );
}
