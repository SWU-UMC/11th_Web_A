
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { getMovies } from "../../api/movies/get-movies";
import type { Movie } from "../../types/movie";
import {
  readBookmarkIds,
  saveBookmarkIds,
} from "../../utils/bookmark-storage";

export function MovieListPage() {
  // 1. 현재 페이지 상태
  const [page, setPage] = useState(1);

  // 2. 북마크 상태
  const [bookmarkIds, setBookmarkIds] = useState<number[]>(
    () => readBookmarkIds()
  );

  // 3. useQuery로 TMDB 영화 목록 요청
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  // 4. 응답 데이터 가져오기
  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  // 5. 페이지 변경
  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  // 6. 북마크 변경 사항 저장
  useEffect(() => {
    saveBookmarkIds(bookmarkIds);
  }, [bookmarkIds]);

  // 7. 북마크 토글
  const handleBookmarkToggle = (id: number) => {
    setBookmarkIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((movieId) => movieId !== id)
        : [...prevIds, id]
    );
  };

  // 8. TMDB 데이터를 기존 Movie 타입에 맞게 변환
  const movieList: Movie[] = movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,

    posterPath: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "",

    backdropPath: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
      : "",

    genres: [],
    runtime: "",
    tagline: "",
    overview: movie.overview,
    isBookmarked: bookmarkIds.includes(movie.id),
  }));

  return (
    <main>
      <section className="movie-section">
        <h2>영화 목록</h2>

        {/* 9. 로딩, 오류, 빈 목록, 성공 상태 처리 */}
        {moviesQuery.isPending ? (
          <p>영화를 불러오는 중이에요.</p>
        ) : moviesQuery.isError ? (
          <p>{moviesQuery.error.message}</p>
        ) : movies.length === 0 ? (
          <p>표시할 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid
              movies={movieList}
              onBookmarkToggle={handleBookmarkToggle}
            />

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </main>
  );
}
