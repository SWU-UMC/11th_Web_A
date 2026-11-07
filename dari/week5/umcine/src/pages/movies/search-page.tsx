/* eslint-disable react-hooks/set-state-in-effect */
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { searchMovies } from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/bookmark-button";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const [searchText, setSearchText] = useState(query ?? "");
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  useEffect(() => {
    let ignore = false;
    const normalizedQuery = query?.trim() ?? "";

    setMovies([]);
    setErrorMessage(null);

    if (!normalizedQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) {
          setMovies(response.results);
        }
      })
      .catch(() => {
        if (!ignore) {
          setErrorMessage("검색 결과를 불러오지 못했어요.");
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
  }, [query]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();

    void navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  const normalizedQuery = query?.trim() ?? "";

  if (!normalizedQuery) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-64px)] w-[min(1160px,calc(100%-48px))] flex-col items-center justify-center pb-24">
        <h1 className="mb-6 text-2xl font-bold">
          어떤 영화를 찾고 있나요?
        </h1>

        <form
          className="flex w-full max-w-[620px] overflow-hidden rounded-md border border-gray-400 bg-white shadow-sm focus-within:border-blue-600"
          onSubmit={handleSubmit}
        >
          <img
            className="ml-4 size-5 self-center opacity-60"
            src="/icons/movie-icons/search.svg"
            alt=""
            aria-hidden="true"
          />

          <input
            className="min-w-0 flex-1 px-3 py-3 outline-none"
            aria-label="검색어"
            placeholder="영화 제목을 입력해 주세요"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />

          <button
            className="m-1 rounded bg-gray-900 px-5 text-sm font-bold text-white"
            type="submit"
          >
            검색
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500">
          검색어를 입력해 주세요.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-[min(1160px,calc(100%-48px))] py-10 pb-20">
      <h1 className="mb-6 text-[28px] font-bold">영화 검색</h1>

      <form
        className="mb-8 flex w-full overflow-hidden rounded-md border border-gray-300 bg-white focus-within:border-blue-600"
        onSubmit={handleSubmit}
      >
        <img
          className="ml-4 size-5 self-center opacity-60"
          src="/icons/movie-icons/search.svg"
          alt=""
          aria-hidden="true"
        />

        <input
          className="min-w-0 flex-1 px-3 py-3 outline-none"
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />

        <button
          className="m-1 rounded bg-gray-900 px-5 text-sm font-bold text-white"
          type="submit"
        >
          검색
        </button>
      </form>

      <h2 className="text-xl font-bold">
        ‘{query}’ 검색 결과
      </h2>

      {isLoading ? (
        <p className="mt-6">검색 결과를 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p className="mt-6 text-red-600">{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p className="mt-6">검색 결과가 없어요.</p>
      ) : (
        <>
          <p className="mt-1 mb-6 text-sm text-gray-500">
            영화 {movies.length}편
          </p>

          <ul className="grid list-none grid-cols-1 gap-x-10 gap-y-6 p-0 lg:grid-cols-2">
            {movies.map((movie) => {
              const posterUrl = getTmdbPosterUrl(movie.poster_path);

              return (
                <li
                  className="grid grid-cols-[110px_1fr] gap-4 border-b border-gray-200 pb-6"
                  key={movie.id}
                >
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                  >
                    {posterUrl ? (
                      <img
                        className="aspect-[2/3] w-full rounded-md object-cover"
                        src={posterUrl}
                        alt={`${movie.title} 포스터`}
                      />
                    ) : (
                      <div className="grid aspect-[2/3] w-full place-items-center rounded-md bg-gray-200 text-xs text-gray-500">
                        이미지 없음
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 py-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold">{movie.title}</h3>
                      <BookmarkButton movieId={movie.id} />
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      {movie.original_title}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      {movie.release_date || "개봉일 정보 없음"}
                    </p>

                    <p className="my-3 line-clamp-3 text-sm leading-6 text-gray-700">
                      {movie.overview || "줄거리 정보가 없어요."}
                    </p>

                    <Link
                      className="text-sm font-bold text-blue-600"
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      상세 보기 →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </main>
  );
}