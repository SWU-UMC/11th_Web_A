type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  // true면 페이지가 1개뿐이어도 표시
  alwaysShow?: boolean
}

// TMDB API는 500페이지까지만 요청할 수 있어요.
const TMDB_MAX_PAGE = 500
// 현재 페이지 양옆으로 보여줄 페이지 수
const SIBLING_COUNT = 2

// 예: 현재 7페이지 → [1, '…', 5, 6, 7, 8, 9, '…', 500]
function getPageItems(currentPage: number, lastPage: number): (number | '…')[] {
  const start = Math.max(2, currentPage - SIBLING_COUNT)
  const end = Math.min(lastPage - 1, currentPage + SIBLING_COUNT)
  const items: (number | '…')[] = [1]

  if (start > 2) items.push('…')
  for (let page = start; page <= end; page++) items.push(page)
  if (end < lastPage - 1) items.push('…')
  if (lastPage > 1) items.push(lastPage)

  return items
}

export function Pagination({ currentPage, totalPages, onPageChange, alwaysShow = false }: PaginationProps) {
  const lastPage = Math.min(totalPages, TMDB_MAX_PAGE)
  if (lastPage < 1 || (lastPage === 1 && !alwaysShow)) return null

  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      <button type="button" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} aria-label="이전 페이지">‹</button>
      {getPageItems(currentPage, lastPage).map((item, index) =>
        item === '…'
          ? <span key={`ellipsis-${index}`} className="pagination__ellipsis" aria-hidden="true">…</span>
          : <button type="button" key={item} aria-current={item === currentPage ? 'page' : undefined} onClick={() => onPageChange(item)}>{item}</button>,
      )}
      <button type="button" disabled={currentPage === lastPage} onClick={() => onPageChange(currentPage + 1)} aria-label="다음 페이지">›</button>
    </nav>
  )
}
