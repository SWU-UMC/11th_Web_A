// Pagination 컴포넌트 규칙 정의
interface PaginationProps {
  currentPage: number; // 현재 몇 페이지인지
  totalPages: number; // 전체 페이지 수
  onPageChange: (page: number) => void; // 페이지 변경 시 호출되는 함수
}

// Pagination 컴포넌트
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <nav className="pagination">
      {/* 이전 페이지 버튼 */}
      <button
        type="button"
        className="pagination-btn"
        disabled={
          currentPage === 1
        } /* 현재 1페이지인 경우, 이전 버튼을 비활성화 */
        onClick={() => onPageChange(currentPage - 1)} /* 이전 페이지로 이동 */
      >
        이전
      </button>

      {/* 페이지 번호 버튼 */}
      {/* totalPages 개수만큼 [1, 2, 3, ...] 번호가 적힌 버튼 배열을 자동으로 생성 */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          type="button"
          className={`pagination-number ${currentPage === page ? "active" : ""}`} /* 현재 페이지와 버튼의 페이지가 같으면 active 클래스 추가 (다른 스타일 적용 */
          onClick={() => onPageChange(page)} /* 클릭한 페이지로 이동 */
        >
          {page}
        </button>
      ))}

      {/* 다음 페이지 버튼 */}
      <button
        type="button"
        className="pagination-btn"
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
