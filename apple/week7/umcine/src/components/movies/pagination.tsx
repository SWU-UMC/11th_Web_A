import { cn } from './../../utils/cn';

// Pagination 컴포넌트 규칙 정의
interface PaginationProps {
  currentPage: number; // 현재 몇 페이지인지
  totalPages: number; // 전체 페이지 수
  onPageChange: (page: number) => void; // 페이지 변경 시 호출되는 함수
}

const PAGE_GROUP_SIZE = 10;

// Pagination 컴포넌트
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // 현재 페이지가 속한 그룹 (1~10 → 0, 11~20 → 1, ...)
  const groupIndex = Math.floor((currentPage - 1) / PAGE_GROUP_SIZE);
  const startPage = groupIndex * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <nav className="flex justify-center items-center gap-2 mt-10">
      {/* 이전 페이지 버튼 */}
      <button
        type="button"
        className="px-3 py-1.5 text-sm text-[#555555] border border-gray-300 rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={
          currentPage === 1
        } /* 현재 1페이지인 경우, 이전 버튼을 비활성화 */
        onClick={() => onPageChange(currentPage - 1)} /* 이전 페이지로 이동 */
      >
        이전
      </button>

      {/* 페이지 번호 버튼 */}
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            "w-8 h-8 flex items-center justify-center text-sm rounded-md text-[#555555]",
            currentPage === page && "bg-blue-600 text-white font-semibold",
          )}
          onClick={() => onPageChange(page)} /* 클릭한 페이지로 이동 */
        >
          {page}
        </button>
      ))}

      {/* 다음 페이지 버튼 */}
      <button
        type="button"
        className="px-3 py-1.5 text-sm text-[#555555] border border-gray-300 rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={
          currentPage === totalPages
        } /* 현재 마지막 페이지인 경우, 다음 버튼을 비활성화 */
        onClick={() => onPageChange(currentPage + 1)} /* 다음 페이지로 이동 */
      >
        다음
      </button>
    </nav>
  );
}
