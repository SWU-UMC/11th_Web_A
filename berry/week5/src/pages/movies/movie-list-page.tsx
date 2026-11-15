import { useState, useEffect } from "react";
import MovieGrid from "../../components/movies/movie-grid.tsx";
import Pagination from "../../components/movies/pagination.tsx";
import { getMovies } from "../../api/movies/get-movies.ts";
import type { TmdbMovieListItem } from "../../api/movies/models.ts";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: currentPage });
        if (!ignore) {
          setMovies(response.results);
          setTotalPages(response.total_pages);
        }
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    loadMovies();
    return () => {
      ignore = true;
    };
  }, [currentPage]);

  return (
    <>
      <h2 className="text-2xl font-bold text-left p-5">영화 목록</h2>
      {isLoading ? (
        <p className="px-5">영화 목록을 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p className="px-5">{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p className="px-5">영화 목록이 없어요.</p>
      ) : (
        <MovieGrid movies={movies} />
      )}
      {!isLoading && !errorMessage && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}
