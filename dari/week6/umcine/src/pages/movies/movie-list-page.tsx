import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        if (!ignore) {
          setMovies([]);
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadMovies();

    return () => {
      ignore = true;
    };
  }, [currentPage]);

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col">
      <main className="mx-auto w-[min(1160px,calc(100%-48px))] flex-1 py-10 pb-20">
        <h1 className="mb-7 text-[28px] leading-tight font-bold">
          영화 목록
        </h1>

        {isLoading ? (
          <p>영화 목록을 불러오는 중이에요.</p>
        ) : errorMessage ? (
          <p className="text-red-600">{errorMessage}</p>
        ) : movies.length === 0 ? (
          <p>조건에 맞는 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid movies={movies} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>

      <footer className="flex min-h-[58px] items-center justify-end gap-2 border-t border-gray-200 bg-white px-6 text-[11px] text-gray-400">
        <span className="font-bold text-cyan-500">TMDB</span>
        <span>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </span>
      </footer>
    </div>
  );
}