
import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { getMovieDetail } from "../../api/movies/get-movie-detail";

export function MovieDetailPage() {
  // 1. URL에서 영화 ID 가져오기
  const { movieId: movieIdParam } = useParams({
    from: "/movies/$movieId",
  });

  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  // 2. useQuery로 영화 상세 정보 요청
  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  // 3. 잘못된 영화 ID
  if (!isValidMovieId) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  // 4. 로딩 상태
  if (movieDetailQuery.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        영화 상세 정보를 불러오는 중이에요.
      </main>
    );
  }

  // 5. 오류 상태
  if (movieDetailQuery.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        {movieDetailQuery.error.message ||
          "영화 정보를 불러오지 못했어요."}
      </main>
    );
  }

  // 6. API 응답 데이터
  const movie = movieDetailQuery.data;

  // 7. 영화 정보가 없는 경우
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
              {movie.runtime
                ? `${movie.runtime}분`
                : "상영 시간 정보 없음"}
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
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 active:bg-indigo-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
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
                  즐겨찾기
                </button>
              </div>
            </div>
          </div>

          {/* 우측: 내 평점 입력 영역 */}
          <div className="flex flex-col gap-4 border-l border-slate-200 pl-8">
            <h3 className="text-lg font-bold text-slate-900">
              내 평점
            </h3>

            <p className="text-xs text-slate-400">
              별점은 필수, 후기는 선택이에요.
            </p>

            {/* 별점 선택 UI */}
            <div className="flex gap-2 text-slate-300">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="rounded border border-slate-200 p-2 text-slate-400 hover:border-amber-400 hover:text-amber-400"
                >
                  ★
                </button>
              ))}
            </div>

            {/* 감상평 입력창 */}
            <textarea
              rows={4}
              placeholder="영화를 보고 느낀 점을 남겨보세요."
              className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none"
            />

            {/* 저장 버튼 */}
            <button
              type="button"
              className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              평점 저장
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
