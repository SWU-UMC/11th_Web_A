import { Link, useParams } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="px-4 py-20 text-center text-[#17191e]">
        <h1 className="text-[21px] font-bold">영화를 찾을 수 없어요.</h1>
        <Link className="mt-4 inline-block text-[#2563eb] hover:underline" to="/">영화 목록</Link>
      </main>
    );
  }

  return <MovieDetail key={movie.id} movie={movie} />;
}

function MovieDetail({ movie }: { movie: Movie }) {
  const [isBookmarked, setIsBookmarked] = useState(movie.isBookmarked);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [savedRating, setSavedRating] = useState<{ rating: number; review: string } | null>(null);
  const [ratingError, setRatingError] = useState(false);

  function handleSaveRating(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating === 0) {
      setRatingError(true);
      return;
    }
    setRatingError(false);
    setSavedRating({ rating, review: review.trim() });
  }

  return (
    <main className="bg-[#f6f7f9] text-[#17191e]">
      <section className="relative isolate flex h-[360px] flex-col justify-between overflow-hidden bg-[#17191e] px-4 py-6 text-white md:px-10 xl:px-20" aria-label="영화 정보">
        <img className="absolute inset-0 -z-20 size-full object-cover object-center" src={movie.backdropPath} alt="" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/55 via-black/15 to-transparent" aria-hidden="true" />
        <Link className="inline-flex w-fit items-center gap-1 text-[13px] font-bold leading-4 hover:underline" to="/">
          <img className="size-6 brightness-0 invert" src="/icons/chevron-left.svg" alt="" />
          영화 목록
        </Link>
        <div className="flex w-full max-w-[800px] flex-col gap-2">
          <h1 className="text-[32px] font-bold leading-tight tracking-[-1.6px] md:text-[46px] md:leading-[49.68px] md:tracking-[-2.3px]">{movie.title}</h1>
          <p className="text-[14px] leading-[17px]">{movie.originalTitle}</p>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[13px] font-bold leading-4">
            <p>{movie.releaseDate}</p>
            <p>{movie.genres.join(" · ")}</p>
            <p>{movie.runtime}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-8 px-4 py-6 md:grid-cols-[200px_minmax(0,1fr)] md:px-10 xl:grid-cols-[200px_minmax(0,1fr)_360px] xl:px-20">
        <img
          className="h-[286px] w-[200px] rounded-[10px] object-cover shadow-[0_12px_30px_0_rgb(12_15_20/0.12)]"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />
        <section className="flex min-w-0 flex-col items-start gap-3" aria-labelledby="synopsis-title">
          <h2 id="synopsis-title" className="text-[21px] font-bold leading-[25px] tracking-[-0.63px]">{movie.tagline}</h2>
          <p className="whitespace-pre-line text-[14px] leading-6 text-[#606774]">{movie.overview}</p>
          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => setIsBookmarked((current) => !current)}
            className={cn(
              "inline-flex h-[42px] min-w-[107px] cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 text-[14px] font-extrabold leading-[17px] text-white",
              isBookmarked ? "border-[#1d4ed8] bg-[#1d4ed8]" : "border-white bg-[#2563eb]",
            )}
          >
            <img className="size-4" src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" />
            즐겨찾기
          </button>
        </section>

        <form onSubmit={handleSaveRating} className="flex min-w-0 flex-col gap-2 border-t border-[#e3e6eb] pt-6 md:col-span-2 xl:col-span-1 xl:min-h-[294px] xl:border-l xl:border-t-0 xl:pl-[30px] xl:pt-0" aria-labelledby="rating-title">
          <h2 id="rating-title" className="text-[21px] font-bold leading-[25px] tracking-[-0.63px]">내 평점</h2>
          <p id="rating-hint" className="text-[12px] leading-[14px] text-[#969da8]">별점은 필수, 후기는 선택이에요.</p>
          <div className="flex gap-1" role="group" aria-label="영화 별점" aria-describedby="rating-hint">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value}점`}
                aria-pressed={rating === value}
                onClick={() => {
                  setRating(value);
                  setRatingError(false);
                  setSavedRating(null);
                }}
                className={cn(
                  "flex size-[38px] cursor-pointer items-center justify-center rounded-lg border",
                  value <= rating ? "border-[#2563eb] bg-[#2563eb]" : "border-[#e3e6eb] bg-white",
                )}
              >
                <img className={cn("size-6", value <= rating ? "brightness-0 invert" : "opacity-60")} src="/icons/star.svg" alt="" />
              </button>
            ))}
          </div>
          <textarea
            aria-label="영화 후기"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            value={review}
            onChange={(event) => {
              setReview(event.target.value);
              setSavedRating(null);
            }}
            className="h-[102px] w-full resize-none rounded-lg border border-[#e3e6eb] bg-white px-3 pb-[18px] pt-4 text-[13px] leading-[19.5px] placeholder:text-[#969da8] focus:border-[#2563eb] focus:outline-none"
          />
          <button type="submit" className="h-[42px] w-full cursor-pointer rounded-lg border border-white bg-[#17191e] px-4 text-[14px] font-extrabold leading-[17px] text-white hover:bg-[#30343d]">평점 저장</button>
          {ratingError && <p role="alert" className="text-[12px] text-red-600">별점을 선택해 주세요.</p>}
          {savedRating && <p role="status" className="text-[12px] leading-5 text-[#606774]">{savedRating.rating}{savedRating.review ? "점과 후기를" : "점을"} 현재 화면에 저장했어요.</p>}
        </form>
      </div>
    </main>
  );
}
