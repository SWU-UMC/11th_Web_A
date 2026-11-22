import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { getMovies } from "../../api/movies/get-movies";
import {
  createFavorite,
  deleteFavorite,
  getMyFavorites,
} from "../../api/members/favorites";
import { useAuthStore } from "../../stores/auth-store";
import type { Movie } from "../../types/movie";

export function MovieListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  // 1. 현재 페이지 상태
  const [page, setPage] = useState(1);

  // 2. 서버에서 내 즐겨찾기 목록 조회 (GET /favorites)
  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getMyFavorites,
    enabled: Boolean(accessToken),
  });
  const bookmarkedIds = (favoritesQuery.data ?? []).map((item) => item.movieId);

  // 3. 즐겨찾기 등록 / 해제 Mutation (POST & DELETE /favorites)
  const toggleFavoriteMutation = useMutation({
    mutationFn: (movieId: number) =>
      bookmarkedIds.includes(movieId)
        ? deleteFavorite(movieId)
        : createFavorite(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => {
      alert("즐겨찾기 처리에 실패했어요.");
    },
  });

  const handleBookmarkToggle = (movieId: number) => {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      navigate({ to: "/login" });
      return;
    }
    if (toggleFavoriteMutation.isPending) return;
    toggleFavoriteMutation.mutate(movieId);
  };

  // 4. useQuery로 TMDB 영화 목록 요청
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  // 5. 응답 데이터 가져오기
  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  // 6. 페이지 변경
  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  // 7. TMDB 데이터를 기존 Movie 타입에 맞게 변환
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
    isBookmarked: bookmarkedIds.includes(movie.id),
  }));

  return (
    <main>
      <section className="movie-section">
        <h2>영화 목록</h2>

        {/* 8. 로딩, 오류, 빈 목록, 성공 상태 처리 */}
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