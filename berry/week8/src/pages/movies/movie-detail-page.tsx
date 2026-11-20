import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail.ts";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message.ts";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image.ts";
import { useCreateRatingMutation } from "../../hooks/use-create-rating-mutation.ts";
import { useCreateFavoriteMutation } from "../../hooks/use-create-favorite-mutation.ts";
import { useDeleteFavoriteMutation } from "../../hooks/use-delete-favorite-mutation.ts";
import { getFavorite } from "../../api/favorites/favorite.ts";
import { useAuthStore } from "../../stores/auth-store.ts";

export function MovieDetailPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  const createRatingMutation = useCreateRatingMutation();

  const favoriteQuery = useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavorite(movieId),
    enabled: Boolean(accessToken) && isValidMovieId,
  });

  const createFavoriteMutation = useCreateFavoriteMutation();
  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  const isBookmarked = favoriteQuery.data?.isFavorite ?? false;

  function handleBookmarkClick() {
    if (isBookmarked) {
      deleteFavoriteMutation.mutate(movieId);
    } else {
      createFavoriteMutation.mutate({ movieId });
    }
  }

  if (!isValidMovieId) {
    return (
      <main className="px-6 py-12 text-center text-lg">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="px-6 py-12 text-center text-lg">
        영화 상세 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="px-6 py-12 text-center text-lg">
        {getMovieDetailErrorMessage(movieDetailQuery.error)}
      </main>
    );
  }

  const movie = movieDetailQuery.data;
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const runtimeText =
    movie.runtime === null
      ? "상영 시간 정보가 없어요."
      : movie.runtime >= 60
        ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
        : `${movie.runtime}분`;

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="relative h-[450px] w-full overflow-hidden bg-gray-300">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-between px-6 py-8 text-white">
            <div>
              <Link
                to="/"
                className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-300 transition-colors hover:text-white"
              >
                <img
                  src="/icons/chevron-left.svg"
                  alt=""
                  className="brightness-0 invert"
                />
                영화 목록
              </Link>
            </div>
            <div className="pb-4">
              <h1 className="mb-2 text-4xl font-extrabold">{movie.title}</h1>
              <p className="mb-2 text-lg text-gray-300">
                {movie.original_title}
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span>{movie.release_date || "개봉일 정보 없음"}</span>
                <span aria-hidden="true">·</span>
                <p>{movie.genres.map((genre) => genre.name).join(", ")}</p>
                <span>{runtimeText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-[1440px] grid-cols-1 gap-12 px-6 lg:grid-cols-3">
        <div className="flex gap-8 lg:col-span-2">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="h-[360px] w-[240px] flex-shrink-0 rounded-xl border-2 border-black object-cover shadow-md"
            />
          ) : (
            <div className="flex h-[360px] w-[240px] flex-shrink-0 items-center justify-center rounded-xl bg-gray-200 text-gray-500">
              포스터 없음
            </div>
          )}
          <div className="flex flex-col justify-start">
            {movie.tagline && (
              <h2 className="mb-3 text-2xl font-bold">{movie.tagline}</h2>
            )}
            <p className="mb-4 text-sm font-semibold text-gray-800">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>
            <button
              type="button"
              className="flex w-max items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
              onClick={handleBookmarkClick}
              aria-pressed={isBookmarked}
              disabled={
                !accessToken ||
                favoriteQuery.isPending ||
                createFavoriteMutation.isPending ||
                deleteFavoriteMutation.isPending
              }
            >
              <img
                src={
                  isBookmarked
                    ? "/icons/bookmark.svg"
                    : "/icons/bookmark-outline.svg"
                }
                alt=""
                aria-hidden="true"
                className="brightness-0 invert"
              />
              <span>즐겨찾기</span>
            </button>
          </div>
        </div>

        <aside
          className="border-l border-gray-200 pl-0 lg:pl-8"
          aria-labelledby="rating-title"
        >
          <h2
            id="rating-title"
            className="mb-2 text-xl font-bold text-gray-900"
          >
            내 평점
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            별점은 필수, 후기는 선택이에요.
          </p>
          <div className="mb-4 flex gap-2" role="group" aria-label="별점 선택">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                onClick={() => setRating(score)}
                aria-label={`${score}점`}
                aria-pressed={rating === score}
                className={`flex h-11 w-11 items-center justify-center rounded-lg border text-2xl transition-colors ${rating >= score ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-200 bg-white text-gray-400 hover:border-blue-300"}`}
              >
                <img
                  src="/icons/star.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-6 w-6 transition-[filter]"
                  style={{
                    filter:
                      rating >= score
                        ? "brightness(0) saturate(100%) invert(27%) sepia(94%) saturate(2852%) hue-rotate(216deg) brightness(101%) contrast(105%)"
                        : "none",
                  }}
                />
              </button>
            ))}
          </div>
          <label htmlFor="movie-review" className="sr-only">
            후기
          </label>
          <textarea
            id="movie-review"
            value={review}
            onChange={(event) => setReview(event.target.value)}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            rows={5}
            className="mb-3 w-full resize-y rounded-lg border border-gray-200 p-4 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500"
          />
          <button
            type="button"
            disabled={rating === 0 || createRatingMutation.isPending}
            onClick={() =>
              createRatingMutation.mutate({
                movieId,
                score: rating,
                comment: review.trim(),
              })
            }
            className="w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {createRatingMutation.isPending ? "저장 중..." : "평점 저장"}
          </button>
        </aside>
      </div>
    </main>
  );
}
