import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="p-25 text-center text-[#888]">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main className="w-full bg-white text-[#111] font-sans">
      <div className="relative w-full h-95 bg-black overflow-hidden">
        <img
          className="absolute inset-0 w-full h-full object-cover object-center"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-black/10" />

        <div className="relative z-10 max-w-275 h-full mx-auto p-5 sm:px-5 sm:py-6 flex flex-col justify-between box-border">
          <Link
            className="flex items-center text-white no-underline text-sm font-medium opacity-90"
            to="/"
          >
            <img src="/icons/chevron-left.svg" class="invert brightness-0" />
            <span>영화 목록</span>
          </Link>
          <div className="text-white mb-6">
            <h1 className="text-[34px] font-extrabold mb-2 tracking-[-0.5px] text-white">
              {movie.title}
            </h1>
            <p className="text-sm text-white/70 mb-2">{movie.originalTitle}</p>
            <p className="text-[13px] text-white/90 m-0">
              {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-275 mx-auto px-5 pt-5 pb-15 grid grid-cols-[1fr_300px] gap-12">
        <div className="flex gap-7 items-start">
          <img
            className="w-50 h-72.5 object-cover rounded-lg relative z-20 shadow-[0_10px_20px_rgba(0,0,0,0.2)] shrink-0"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />

          <div className="pt-6 flex-1">
            <h2 className="text-lg font-bold mb-4 text-[#111] leading-[1.4]">
              {movie.tagline}
            </h2>
            <p className="text-sm leading-[1.6] text-[#555] mb-6">
              {movie.overview}
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 pt-2.5 pb-2.5 pr-5 pl-3.75 bg-blue-600 text-white border-none rounded-md text-sm font-semibold cursor-pointer"
            >
              <img
                src="/icons/bookmark-outline.svg"
                alt=""
                className="w-5 h-5 invert brightness-0"
              />
              즐겨찾기
            </button>
          </div>
        </div>

        <aside className="pt-6 flex flex-col">
          <h3 className="text-base font-bold mb-1">내 평점</h3>
          <p className="text-xs text-[#888] mb-4">
            별점은 필수, 후기는 선택이에요.
          </p>

          <div className="flex gap-2 text-xl text-gray-300 mb-4 cursor-pointer">
            <img src="/icons/star.svg" />
            <img src="/icons/star.svg" />
            <img src="/icons/star.svg" />
            <img src="/icons/star.svg" />
            <img src="/icons/star.svg" />
          </div>

          <textarea
            className="w-full h-22.5 p-3 border border-gray-200 rounded-md text-[13px] resize-none outline-none mb-4 bg-[#fafafa] focus:bg-white focus:border-[#111]"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
          />

          <button
            type="button"
            className="w-full h-11 bg-gray-800 text-white border-none rounded-md text-sm font-semibold cursor-pointer"
          >
            평점 저장
          </button>
        </aside>
      </div>
    </main>
  );
}
