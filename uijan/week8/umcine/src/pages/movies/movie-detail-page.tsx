import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getMovieDetail } from "../../api/movies/get-movie-detail";
import {
  createFavorite,
  deleteFavorite,
  getFavoriteStatus,
} from "../../api/members/favorites";
import {
  createRating,
  deleteRating,
  getMemberRatings,
  updateRating,
} from "../../api/members/ratings";
import { useAuthStore } from "../../stores/auth-store";

function extractMemberId(token: string | null): number | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    const id = Number(payload.memberId ?? payload.sub);
    return Number.isInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

export function MovieDetailPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = extractMemberId(accessToken);

  // 1. URL에서 영화 ID 가져오기
  const { movieId: movieIdParam } = useParams({
    from: "/movies/$movieId",
  });

  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  // 2. 영화 상세 정보 조회 (TMDB)
  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  // 3. 즐겨찾기 여부 조회 (GET /favorites/{movieId})
  const favoriteStatusQuery = useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken) && isValidMovieId,
  });
  const isFavorite = favoriteStatusQuery.data ?? false;

  // 4. 즐겨찾기 등록/해제 Mutation (POST & DELETE /favorites)
  const toggleFavoriteMutation = useMutation({
    mutationFn: () =>
      isFavorite ? deleteFavorite(movieId) : createFavorite(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => {
      alert("즐겨찾기 처리에 실패했어요.");
    },
  });

  // 5. 내 평점 목록 조회 후 현재 영화 평점 찾기 (GET /members/{memberId}/ratings)
  const ratingsQuery = useQuery({
    queryKey: ["ratings", memberId],
    queryFn: () => getMemberRatings(memberId!),
    enabled: Boolean(memberId),
  });
  const existingRating = ratingsQuery.data?.find(
    (item) => item.movieId === movieId,
  );

  // 평점 입력 폼 상태
  const [score, setScore] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  // 기존에 작성한 평점이 있으면 폼에 자동으로 채워 넣기
  useEffect(() => {
    if (existingRating) {
      setScore(existingRating.score);
      setComment(existingRating.comment ?? "");
    } else {
      setScore(0);
      setComment("");
    }
  }, [existingRating]);

  // 6. 평점 등록 / 수정 Mutation (POST /ratings, PATCH /ratings/{ratingId})
  const saveRatingMutation = useMutation({
    mutationFn: () => {
      const trimmedComment = comment.trim() || undefined;
      if (existingRating) {
        return updateRating(existingRating.ratingId, {
          score,
          comment: trimmedComment,
        });
      }
      return createRating({
        movieId,
        score,
        comment: trimmedComment,
      });
    },
    onSuccess: () => {
      alert(existingRating ? "평점을 수정했어요." : "평점을 저장했어요.");
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
    },
    onError: () => {
      alert("평점 저장에 실패했어요.");
    },
  });

  // 7. 평점 삭제 Mutation (DELETE /ratings/{ratingId})
  const deleteRatingMutation = useMutation({
    mutationFn: () => deleteRating(existingRating!.ratingId),
    onSuccess: () => {
      alert("평점을 삭제했어요.");
      setScore(0);
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
    },
    onError: () => {
      alert("평점 삭제에 실패했어요.");
    },
  });

  // 이벤트 핸들러
  const handleFavoriteClick = () => {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      navigate({ to: "/login" });
      return;
    }
    if (toggleFavoriteMutation.isPending) return;
    toggleFavoriteMutation.mutate();
  };

  const handleSaveRating = () => {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      navigate({ to: "/login" });
      return;
    }
    if (score < 1 || score > 5) {
      alert("별점을 1~5점 사이로 선택해 주세요.");
      return;
    }
    if (saveRatingMutation.isPending) return;
    saveRatingMutation.mutate();
  };

  // 예외 및 로딩 분기
  if (!isValidMovieId) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        영화 상세 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        {movieDetailQuery.error.message || "영화 정보를 불러오지 못했어요."}
      </main>
    );
  }

  const movie = movieDetailQuery.data;
  if (!movie) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] text-slate-900">
      {/* Hero Section */}
      <section className="relative h-[380px] w-full overflow-hidden bg-black text-white">
        <img
          src={
            movie.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : ""
          }
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-between px-6 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-200 transition-colors hover:text-white"
          >
            <span className="text-lg">‹</span> 영화 목록
          </Link>

          <div className="mb-4">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              {movie.title}
            </h1>

            <p className="mt-2 text-sm text-slate-300">
              {movie.original_title}
            </p>

            <p className="mt-2 text-sm font-medium text-slate-200">
              {movie.release_date}
              {" · "}
              {movie.genres.map((genre) => genre.name).join(" · ")}
              {" · "}
              {movie.runtime ? `${movie.runtime}분` : "상영 시간 정보 없음"}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
          {/* 좌측: 포스터 + 영화 소개 정보 */}
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="w-full shrink-0 sm:w-[220px]">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : ""
                }
                alt={`${movie.title} 포스터`}
                className="w-full rounded-xl object-cover shadow-lg"
              />
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-900">
                {movie.tagline}
              </h2>

              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {movie.overview}
              </p>

              {/* 즐겨찾기 버튼 */}
              <div>
                <button
                  type="button"
                  onClick={handleFavoriteClick}
                  disabled={toggleFavoriteMutation.isPending}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors ${
                    isFavorite
                      ? "bg-rose-600 text-white hover:bg-rose-500"
                      : "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isFavorite ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                    />
                  </svg>
                  {isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
                </button>
              </div>
            </div>
          </div>

          {/* 우측: 내 평점 입력 영역 */}
          <div className="flex flex-col gap-4 border-l border-slate-200 pl-8">
            <h3 className="text-lg font-bold text-slate-900">내 평점</h3>

            <p className="text-xs text-slate-400">
              별점은 필수, 후기는 선택이에요.
            </p>

            {/* 별점 선택 UI */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setScore(star)}
                  className={`rounded border p-2 transition-colors ${
                    star <= score
                      ? "border-amber-400 bg-amber-50 text-amber-400"
                      : "border-slate-200 text-slate-300 hover:border-amber-400 hover:text-amber-400"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* 감상평 입력창 */}
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="영화를 보고 느낀 점을 남겨보세요."
              className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
            />

            {/* 저장 / 수정 버튼 */}
            <button
              type="button"
              onClick={handleSaveRating}
              disabled={saveRatingMutation.isPending}
              className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {saveRatingMutation.isPending
                ? "저장 중..."
                : existingRating
                  ? "평점 수정"
                  : "평점 저장"}
            </button>

            {/* 이미 작성한 평점이 있을 때만 삭제 버튼 표시 */}
            {existingRating && (
              <button
                type="button"
                onClick={() => deleteRatingMutation.mutate()}
                disabled={deleteRatingMutation.isPending}
                className="w-full rounded-lg border border-rose-200 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
              >
                {deleteRatingMutation.isPending ? "삭제 중..." : "평점 삭제"}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}