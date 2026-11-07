
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";

import { searchMovies } from "../../api/movies/search-movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  // 1. 검색창 입력값 관리
  const [searchText, setSearchText] = useState(query ?? "");

  // 2. URL의 검색어 정리
  const normalizedQuery = query?.trim() ?? "";

  // 3. useQuery로 TMDB 검색 API 요청
  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: () => searchMovies({ query: normalizedQuery }),
    enabled: normalizedQuery.length > 0,
  });

  // 4. 검색 결과 가져오기
  const movies = searchQuery.data?.results ?? [];

  // 5. 검색 버튼 클릭
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  // 6. 검색어 지우기
  const handleClear = () => {
    setSearchText("");
  };

  const hasQuery = Boolean(normalizedQuery);

  return (
    <main
      className={`flex min-h-screen flex-col justify-between bg-[#f5f6f8] px-6 ${
        hasQuery ? "pt-10 pb-6" : "pt-48 pb-20"
      }`}
    >
      <div
        className={`mx-auto w-full transition-all duration-300 ${
          hasQuery ? "max-w-[1200px]" : "max-w-[786px]"
        }`}
      >
        {/* 1. 검색 전 초기 화면 */}
        {!hasQuery ? (
          <section className="w-full">
            <h1 className="mb-9 text-center text-4xl font-bold tracking-tight text-[#191a20]">
              어떤 영화를 찾고있나요?
            </h1>

            <form
              onSubmit={handleSubmit}
              className="flex h-[74px] items-center gap-4 rounded-xl border-2 border-[#191a20] bg-white px-5 shadow-[0_12px_25px_rgba(0,0,0,0.08)]"
            >
              <img
                src="../movie-icons/search.svg"
                alt="검색"
                className="h-[22px] w-[22px] shrink-0"
              />

              <input
                aria-label="검색어"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="예: 스파이더맨"
                className="h-full min-w-0 flex-1 bg-transparent text-base text-[#191a20] outline-none placeholder:text-gray-400"
              />

              {searchText && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}

              <button
                type="submit"
                className="shrink-0 rounded-lg bg-[#191a20] px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                검색
              </button>
            </form>
          </section>
        ) : (
          /* 2. 검색 후 결과 레이아웃 화면 */
          <>
            <h1 className="mb-8 text-3xl font-extrabold text-[#111827]">
              영화 검색
            </h1>

            {/* 상단 검색 폼 */}
            <section className="mb-10">
              <form
                onSubmit={handleSubmit}
                className="flex h-14 items-center rounded-xl border border-gray-100 bg-white px-5 shadow-sm"
              >
                <svg
                  className="mr-3 h-5 w-5 shrink-0 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                <input
                  aria-label="검색어"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="영화 제목을 입력하세요"
                  className="h-full flex-1 bg-transparent text-base font-medium text-gray-900 outline-none placeholder:text-gray-400"
                />

                {searchText && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="mr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}

                <button
                  type="submit"
                  className="rounded-lg bg-[#1c1d21] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-black"
                >
                  다시 검색
                </button>
              </form>
            </section>

            {/* 검색 결과 리스트 */}
            <section>
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="text-xl font-bold text-[#111827]">
                  '{query}' 검색 결과
                </h2>

                <span className="text-sm font-medium text-gray-400">
                  영화 {searchQuery.isPending ? "..." : movies.length}편 · 1페이지
                </span>
              </div>

              {searchQuery.isPending ? (
                <p className="py-20 text-center text-gray-500">
                  검색 결과를 불러오는 중...
                </p>
              ) : searchQuery.isError ? (
                <p className="py-20 text-center text-red-500">
                  {searchQuery.error.message}
                </p>
              ) : movies.length === 0 ? (
                <p className="py-20 text-center text-gray-500">
                  검색 결과가 없어요.
                </p>
              ) : (
                <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {movies.map((movie) => (
                    <li
                      key={movie.id}
                      className="flex overflow-hidden rounded-xl bg-white transition hover:shadow-md"
                    >
                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                        className="shrink-0"
                      >
                        <img
                          src={
                            movie.poster_path
                              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                              : "/placeholder.png"
                          }
                          alt={`${movie.title} 포스터`}
                          className="h-56 w-36 object-cover"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <div className="mb-1 flex items-baseline gap-2">
                            <h3 className="text-lg font-bold text-[#111827]">
                              <Link
                                to="/movies/$movieId"
                                params={{ movieId: String(movie.id) }}
                                className="hover:underline"
                              >
                                {movie.title}
                              </Link>
                            </h3>
                          </div>

                          <p className="mb-3 text-xs text-gray-400">
                            {movie.original_title}{" "}
                            {movie.release_date && `· ${movie.release_date}`}
                          </p>

                          <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
                            {movie.overview || "줄거리 정보가 없습니다."}
                          </p>
                        </div>

                        <div className="mt-4">
                          <Link
                            to="/movies/$movieId"
                            params={{ movieId: String(movie.id) }}
                            className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800"
                          >
                            상세 보기 &rarr;
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>

      {/* 우측 하단 TMDB 출처 표시 */}
      <footer className="mt-12 flex items-center justify-end gap-2 text-xs text-gray-500">
        <svg
          className="h-3 w-8 shrink-0 text-[#0d253f]"
          viewBox="0 0 186.04 129.17"
          fill="currentColor"
        >
          <path d="M124.08,0H61.96L0,61.96l61.96,67.21h62.12l61.96-67.21L124.08,0z M117.89,114.73H68.15L20.21,61.96l47.94-52.77h49.74l47.94,52.77L117.89,114.73z" />
        </svg>

        <span>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-gray-700"
          >
            TMDB
          </a>
          .
        </span>
      </footer>
    </main>
  );
}
