import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) => currentMovies.map((movie) =>
      movie.id === movieId ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
    ));
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col">
      <main className="mx-auto w-[min(1160px,calc(100%-48px))] flex-1 py-10 pb-20">
        <h1 className="mb-7 text-[28px] leading-tight font-bold">영화 목록</h1>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
      </main>
      <footer className="flex min-h-[58px] items-center justify-end gap-2 border-t border-gray-200 bg-white px-6 text-[11px] text-gray-400">
        <span className="font-bold text-cyan-500">TMDB</span>
        <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
      </footer>
    </div>
  );
}
