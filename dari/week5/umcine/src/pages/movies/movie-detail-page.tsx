import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) return <main className="mx-auto w-[min(1160px,calc(100%-48px))] py-8">영화를 찾을 수 없어요.</main>;

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col">
      <main className="flex-1">
      <section className="relative h-[290px] overflow-hidden bg-gray-900 text-white">
        <img className="absolute inset-0 size-full object-cover" src={movie.backdropPath} alt="" aria-hidden="true" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative mx-auto flex h-full w-[min(1040px,calc(100%-48px))] flex-col py-6">
          <Link className="flex w-fit items-center gap-2 text-sm font-bold" to="/">
            <span aria-hidden="true">‹</span> 영화 목록
          </Link>
          <div className="mt-auto pb-1">
            <h1 className="text-[32px] leading-tight font-bold">{movie.title}</h1>
            <p className="mt-3 text-sm text-gray-100">{movie.originalTitle}</p>
            <p className="mt-2 text-sm font-bold">
              {movie.releaseDate} <span className="mx-1.5">·</span>
              {movie.genres.join(" · ")} <span className="mx-1.5">·</span>
              {movie.runtime}
            </p>
          </div>
        </div>
      </section>
      <div className="mx-auto grid w-[min(1040px,calc(100%-48px))] gap-6 py-5 md:grid-cols-[160px_minmax(0,1fr)_290px]">
        <img className="aspect-[2/3] w-40 rounded-lg object-cover shadow-md" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <section className="min-w-0 px-1">
          <h2 className="text-lg font-bold">{movie.tagline}</h2>
          <p className="mt-3 text-sm leading-6 text-gray-500">{movie.overview}</p>
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
          <p className="mt-2 text-xs text-gray-400">별점을 필수, 후기는 선택이에요.</p>
          <div className="mt-3 flex gap-1" aria-label="평점 선택">
            {[1, 2, 3, 4, 5].map((score) => (
              <button key={score} className="grid size-8 place-items-center rounded-md border border-gray-200 bg-white" type="button" aria-label={`${score}점`}>
                <img className="size-5" src="/icons/movie-icons/star-outline.svg" alt="" aria-hidden="true" />
              </button>
            ))}
          </div>
          <textarea className="mt-2.5 h-20 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-xs outline-none focus:border-blue-600" placeholder="영화를 보고 느낀 점을 남겨보세요." aria-label="평점 후기" />
          <button className="mt-2 w-full rounded-md bg-gray-900 py-2.5 text-sm font-bold text-white" type="button">평점 저장</button>
        </aside>
      </div>
      </main>
      <footer className="flex min-h-[48px] items-center justify-end gap-2 border-t border-gray-200 bg-white px-6 text-[11px] text-gray-400">
        <span className="font-bold text-cyan-500">TMDB</span>
        <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
      </footer>
    </div>
  );
}
