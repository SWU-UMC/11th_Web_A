import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="max-w-[1440px] mx-auto px-6 py-12 text-center text-lg">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* 1. 상단 백드롭 배너 영역 */}
      <div className="relative w-full h-[450px] bg-black overflow-hidden">
        {/* 백드롭 이미지 */}
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          {/* 배너 내부 텍스트 및 정보 */}
          <div className="relative max-w-[1440px] mx-auto px-6 h-full flex flex-col justify-between py-8 text-white">
            <div>
              <Link
                to="/"
                className="text-sm text-gray-300 hover:text-white mb-4 inline-flex items-center gap-1.5 transition-colors"
              >
                <img
                  src="../../../public/icons/chevron-left.svg"
                  className="brightness-0 invert"
                />
                영화 목록
              </Link>
            </div>
            <div className="pb-4">
              <h1 className="text-4xl font-extrabold mb-2">{movie.title}</h1>
              <p className="text-lg text-gray-300 mb-2">
                {movie.originalTitle}
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span>{movie.releaseDate}</span>
                <span>.</span>
                <p>{movie.genres.join(" · ")}</p>
                <span>{movie.runtime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 상세 정보 영역 */}
      <div className="max-w-[1440px] mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* 왼쪽: 포스터, 태그라인, 개요, 북마크 */}
        <div className="lg:col-span-2 flex gap-8">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="w-[240px] h-[360px] object-cover rounded-xl shadow-md border-2 border-black flex-shrink-0"
          />
          <div className="flex flex-col justify-start">
            <h2 className="text-2xl font-bold mb-3">{movie.tagline}</h2>
            <p className="text-sm font-semibold text-gray-800 mb-4">
              {movie.overview}
            </p>
            <button className="flex items-center justify-center gap-2 w-max bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">
              <img
                src="../../../public/icons/bookmark-outline.svg"
                className="brightness-0 invert"
              />
              <span>즐겨찾기</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
