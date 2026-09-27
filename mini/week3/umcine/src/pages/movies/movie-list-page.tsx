import { useState } from "react";

import MovieGrid from "../../components/movies/movie-grid";
import { movies as initialMovies } from "../../data/movies";

import "../../App.css";

export function MovieListPage() {
  // 영화 목록 상태
  const [movies, setMovies] = useState(initialMovies);

  // 북마크 상태 변경
  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <>

      {/* 영화 목록 페이지 본문 */}
      <main className="movie-page">
        <h1 className="page-title">영화 목록</h1>

        {/* 영화 카드 목록 */}
        <MovieGrid
          movies={movies}
          onToggleBookmark={handleToggleBookmark}
        />
      </main>
    </>
  );
}