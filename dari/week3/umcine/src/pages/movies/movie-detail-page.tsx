import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) return <main className="mx-auto w-[min(1160px,calc(100%-48px))] py-8">영화를 찾을 수 없어요.</main>;

  return (
    <main className="pb-20">
      <section className="relative h-[330px] overflow-hidden bg-gray-900 text-white">
        <img className="absolute inset-0 size-full object-cover" src={movie.backdropPath} alt="" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
        <div className="relative mx-auto flex h-full w-[min(1160px,calc(100%-48px))] flex-col justify-end pb-10">
          <p className="mb-2 text-sm text-gray-200">{movie.originalTitle}</p>
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="mt-3 text-lg">{movie.tagline}</p>
        </div>
      </section>
      <div className="mx-auto grid w-[min(1160px,calc(100%-48px))] gap-10 py-10 md:grid-cols-[220px_1fr_260px]">
        <img className="w-full rounded-lg shadow-lg" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <section>
          <h2 className="text-xl font-bold">{movie.title}</h2>
          <p className="mt-2 text-sm text-gray-500">{movie.originalTitle}</p>
          <dl className="mt-6 grid grid-cols-[72px_1fr] gap-y-3 text-sm">
            <dt className="font-bold">개봉일</dt><dd>{movie.releaseDate}</dd>
            <dt className="font-bold">장르</dt><dd>{movie.genres.join(" · ")}</dd>
            <dt className="font-bold">상영 시간</dt><dd>{movie.runtime}</dd>
          </dl>
          <h3 className="mt-8 font-bold">줄거리</h3>
          <p className="mt-2 text-sm leading-7 text-gray-700">{movie.overview}</p>
          <Link className="mt-6 inline-block text-sm font-bold text-blue-600" to="/">← 영화 목록</Link>
        </section>
        <aside className="h-fit rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold">내 평점</h2>
          <div className="my-5 flex justify-between text-2xl text-yellow-400" aria-label="평점 선택">★★★★★</div>
          <button className="w-full rounded-md bg-gray-900 py-3 text-sm font-bold text-white" type="button">예매하기</button>
        </aside>
      </div>
    </main>
  );
}
