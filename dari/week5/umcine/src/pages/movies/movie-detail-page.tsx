/* eslint-disable react-hooks/set-state-in-effect */

import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/bookmark-button";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

function formatRuntime(runtime: number | null) {
  if (runtime === null) {
    return "상영 시간 정보가 없어요.";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) {
    return `${minutes}분`;
  }

  if (minutes === 0) {
    return `${hours}시간`;
  }

  return `${hours}시간 ${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    setMovie(null);
    setErrorMessage(null);

    if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
      setIsLoading(false);
      setErrorMessage("올바르지 않은 영화 번호예요.");
      return;
    }

    setIsLoading(true);

    getMovieDetail(parsedMovieId)
      .then((response) => {
        if (!ignore) {
          setMovie(response);
        }
      })
      .catch((error: unknown) => {
        if (!ignore) {
          setErrorMessage(getMovieDetailErrorMessage(error));
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [parsedMovieId]);

  if (isLoading) {
    return (
      <main className="mx-auto w-[min(1160px,calc(100%-48px))] py-8">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main className="mx-auto w-[min(1160px,calc(100%-48px))] py-8">
        {errorMessage ?? "영화 정보를 불러오지 못했어요."}
      </main>
    );
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const genreNames =
    movie.genres.length > 0
      ? movie.genres.map((genre) => genre.name).join(", ")
      : "장르 정보 없음";

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col">
      <main className="flex-1">
        <section className="relative h-[290px] overflow-hidden bg-gray-900 text-white">
          {backdropUrl && (
            <img
              className="absolute inset-0 size-full object-cover"
              src={backdropUrl}
              alt=""
              aria-hidden="true"
            />
          )}

          <div className="absolute inset-0 bg-black/35" />

          <div className="relative mx-auto flex h-full w-[min(1040px,calc(100%-48px))] flex-col py-6">
            <Link
              className="flex w-fit items-center gap-2 text-sm font-bold"
              to="/"
            >
              <span aria-hidden="true">‹</span>
              영화 목록
            </Link>

            <div className="mt-auto pb-1">
              <h1 className="text-[32px] leading-tight font-bold">
                {movie.title}
              </h1>

              <p className="mt-3 text-sm text-gray-100">
                {movie.original_title}
              </p>

              <p className="mt-2 text-sm font-bold">
                {movie.release_date || "개봉일 정보 없음"}
                <span className="mx-1.5">·</span>
                {genreNames}
                <span className="mx-1.5">·</span>
                {formatRuntime(movie.runtime)}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto grid w-[min(1040px,calc(100%-48px))] gap-6 py-5 md:grid-cols-[160px_minmax(0,1fr)_290px]">
          {posterUrl ? (
            <img
              className="aspect-[2/3] w-40 rounded-lg object-cover shadow-md"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <div className="grid aspect-[2/3] w-40 place-items-center rounded-lg bg-gray-200 text-sm text-gray-500">
              이미지 없음
            </div>
          )}

          <section className="min-w-0 px-1">
            <h2 className="text-lg font-bold">
              {movie.tagline || "태그라인 정보가 없어요."}
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>

            <BookmarkButton
              movieId={movie.id}
              variant="text"
              inactiveLabel="즐겨찾기"
              activeLabel="즐겨찾기 해제"
              className="mt-4 w-fit border-blue-600 bg-blue-600 px-4 py-2.5 text-white"
            />
          </section>

          <aside className="border-l border-gray-200 pl-6">
            <h2 className="text-lg font-bold">내 평점</h2>
            <p className="mt-2 text-xs text-gray-400">
              별점은 필수, 후기는 선택이에요.
            </p>

            <div className="mt-3 flex gap-1" aria-label="평점 선택">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  className="grid size-8 place-items-center rounded-md border border-gray-200 bg-white"
                  type="button"
                  aria-label={`${score}점`}
                >
                  <img
                    className="size-5"
                    src="/icons/movie-icons/star-outline.svg"
                    alt=""
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>

            <textarea
              className="mt-2.5 h-20 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-xs outline-none focus:border-blue-600"
              placeholder="영화를 보고 느낀 점을 남겨보세요."
              aria-label="평점 후기"
            />

            <button
              className="mt-2 w-full rounded-md bg-gray-900 py-2.5 text-sm font-bold text-white"
              type="button"
            >
              평점 저장
            </button>
          </aside>
        </div>
      </main>

      <footer className="flex min-h-[48px] items-center justify-end gap-2 border-t border-gray-200 bg-white px-6 text-[11px] text-gray-400">
        <span className="font-bold text-cyan-500">TMDB</span>
        <span>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </span>
      </footer>
    </div>
  );
}