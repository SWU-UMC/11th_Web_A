import { useState } from "react";

import MovieGrid from "../../components/movies/movie-grid";
import { movies as initialMovies } from "../../data/movies";

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
    <main className="bg-[#f6f7f9] px-4 py-6 md:px-10 xl:px-20">
      <h1 className="m-0 mb-5 text-left font-[Pretendard,sans-serif] text-[38px] font-bold leading-[44px] tracking-[-1.71px] text-[#17191e]">
        영화 목록
      </h1>

      {/* 영화 카드 목록 */}
      <MovieGrid
        movies={movies}
        onToggleBookmark={handleToggleBookmark}
      />
    </main>
  );
}
