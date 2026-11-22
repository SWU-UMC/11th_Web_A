import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid.tsx";
import Pagination from "../../components/movies/pagination.tsx";
import { getMovies } from "../../api/movies/get-movies.ts";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-left p-5">영화 목록</h2>
      {moviesQuery.isPending ? (
        <p className="px-5">영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p className="px-5">{moviesQuery.error.message}</p>
      ) : movies.length === 0 ? (
        <p className="px-5">표시할 영화가 없어요.</p>
      ) : (
        <MovieGrid movies={movies} />
      )}
      {!moviesQuery.isPending && !moviesQuery.isError && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}
