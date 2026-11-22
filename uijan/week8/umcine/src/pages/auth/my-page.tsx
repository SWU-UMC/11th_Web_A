import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import MovieCard from "../../components/movies/movie-card";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMe } from "../../api/members/me";
import { deleteFavorite, getMyFavorites } from "../../api/members/favorites";
import { useAuthStore } from "../../stores/auth-store";
import type { Movie } from "../../types/movie";

export function MyPage() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [currentPage, setCurrentPage] = useState(1);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // 1. 서버 즐겨찾기 목록 + 각 영화의 TMDB 상세 정보를 한 번에 조회
  // (TMDB에 없는 테스트용 movieId는 null로 건너뛰어 전체 실패 방지)
  const bookmarkedMoviesQuery = useQuery({
    queryKey: ["favorites", "mypage"],
    enabled: Boolean(accessToken),
    queryFn: async (): Promise<Movie[]> => {
      const favorites = await getMyFavorites();

      const results = await Promise.all(
        favorites.map(async (item) => {
          try {
            const detail = await getMovieDetail(item.movieId);

            return {
              id: detail.id,
              title: detail.title,
              originalTitle: detail.original_title,
              releaseDate: detail.release_date,
              posterPath: detail.poster_path
                ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
                : "",
              backdropPath: detail.backdrop_path
                ? `https://image.tmdb.org/t/p/w500${detail.backdrop_path}`
                : "",
              genres: detail.genres.map((genre) => genre.name),
              runtime: detail.runtime ? String(detail.runtime) : "",
              tagline: detail.tagline,
              overview: detail.overview,
              isBookmarked: true,
            } as Movie;
          } catch {
            return null;
          }
        }),
      );

      return results.filter((movie): movie is Movie => movie !== null);
    },
  });

  // 2. 마이페이지 카드에서 북마크 해제 클릭 시 서버 삭제 (DELETE /favorites/{movieId})
  const removeFavoriteMutation = useMutation({
    mutationFn: (movieId: number) => deleteFavorite(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => {
      alert("즐겨찾기 해제에 실패했어요.");
    },
  });

  const bookmarkedMovies = bookmarkedMoviesQuery.data ?? [];
  const isLoading = bookmarkedMoviesQuery.isLoading;

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#f8f9fa] px-6 py-10">
      <div className="mx-auto w-full max-w-[1080px]">
        {/* 상단 타이틀 및 정보 수정 버튼 */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <h1 className="text-[26px] font-bold tracking-tight text-gray-900">
            내 정보
          </h1>
          <Link
            to="/mypage_edit"
            className="rounded-lg bg-[#4b6bfb] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#3b5bdb]"
          >
            정보 수정
          </Link>
        </div>

        {/* 기본 정보 섹션 */}
        <section className="border-b border-gray-200 py-7">
          <h2 className="mb-5 text-sm font-bold text-gray-900">기본 정보</h2>
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-800">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
              </svg>
            </div>
            <div className="grid w-full max-w-[540px] grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-[11px] font-medium text-gray-400">
                  닉네임
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {meQuery.data?.nickname ?? "-"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-[11px] font-medium text-gray-400">
                  이메일
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {meQuery.data?.email ?? "-"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 내 즐겨찾기 섹션 */}
        <section className="pt-7">
          <h2 className="mb-5 text-sm font-bold text-gray-900">내 즐겨찾기</h2>

          {isLoading ? (
            <p className="py-12 text-center text-sm text-gray-400">
              즐겨찾기 목록을 불러오는 중...
            </p>
          ) : bookmarkedMovies.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-400">
              즐겨찾기한 영화가 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {bookmarkedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onBookmarkToggle={(movieId) => {
                    if (!removeFavoriteMutation.isPending) {
                      removeFavoriteMutation.mutate(movieId);
                    }
                  }}
                />
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {bookmarkedMovies.length > 0 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200/60 disabled:cursor-not-allowed disabled:opacity-40"
              >
                &lt;
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18191f] text-xs font-semibold text-white"
              >
                {currentPage}
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200/60"
              >
                &gt;
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}