import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getMovies } from '../../api/movies/get-movies'
import { toMovie } from '../../utils/movies/to-movie'
import { MovieGrid } from '../../components/movies/movie-grid'
import { Pagination } from '../../components/movies/pagination'
import { useBookmarkStore } from '../../stores/bookmark-store'
import './movie-list-page.css'

export function MovieListPage() {
  // 현재 페이지 번호 관리
  const [currentPage, setCurrentPage] = useState(1)

  // 북마크 상태 관리
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  )

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  )

  // TanStack Query로 영화 목록 조회
  const moviesQuery = useQuery({
    queryKey: ['movies', 'list', { page: currentPage }],
    queryFn: () => getMovies({ page: currentPage }),
    // 다음 페이지를 불러오는 동안 이전 페이지 목록을 유지
    placeholderData: keepPreviousData,
  })

  // 서버에서 받은 영화 목록
  const movies = moviesQuery.data?.results ?? []
  const totalPages = moviesQuery.data?.total_pages ?? 0

  // 영화 목록에 북마크 여부 추가
  const movieList = movies.map((movie) =>
    toMovie(movie, bookmarkedMovieIds.includes(movie.id)),
  )

  // 페이지 변경
  const handlePageChange = (nextPage: number) => {
    setCurrentPage(nextPage)
    // 페이지를 바꾸면 목록 맨 위로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <main className="movie-list-page">
        <div className="movie-list-page__inner">
          <h1>영화 목록</h1>

          {moviesQuery.isPending ? (
            <p>영화를 불러오는 중이에요.</p>
          ) : moviesQuery.isError ? (
            <p>오류가 발생했어요: {moviesQuery.error.message}</p>
          ) : movieList.length === 0 ? (
            <p>표시할 영화가 없어요.</p>
          ) : (
            <>
              <MovieGrid
                movies={movieList}
                onToggleBookmark={toggleBookmark}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </main>

      <footer className="movie-footer">
        <div className="movie-footer__inner">
          <img
            src="/images/logos/tmdb-logo.svg"
            alt="TMDB"
          />
          <span>
            This product uses the TMDB API but is not
            endorsed or certified by TMDB.
          </span>
        </div>
      </footer>
    </>
  )
}
