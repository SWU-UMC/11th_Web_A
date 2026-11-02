import { useState } from "react";
import { movies } from "../../data/movies.ts";
import MovieGrid from "../../components/movies/movie-grid.tsx";
import Pagination from "../../components/movies/pagination.tsx";

const MOVIES_PER_PAGE = 10;

export function MovieListPage() {
  const [initialMovies, setMovies] = useState(movies);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(initialMovies.length / MOVIES_PER_PAGE);
  const pageMovies = initialMovies.slice(
    (currentPage - 1) * MOVIES_PER_PAGE,
    currentPage * MOVIES_PER_PAGE,
  );

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
      <h2 className="text-2xl font-bold text-left p-5">영화 목록</h2>
      <MovieGrid movies={pageMovies} onToggleBookmark={handleToggleBookmark} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
