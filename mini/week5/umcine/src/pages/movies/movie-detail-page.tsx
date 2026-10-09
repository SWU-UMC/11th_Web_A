import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { cn } from "../../utils/cn";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { isHTTPError } from "ky";
import { createRating } from "../../api/ratings/create-rating";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  // URL의 movieId는 문자열이므로 API 요청을 위해 숫자로 변환
  const parsedMovieId = Number(movieId);

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // 이전 요청의 응답이 현재 화면의 상태를 변경하지 않도록 관리
    let ignore = false;

    setMovie(null);
    setErrorMessage(null);

    // 양의 정수가 아닌 영화 ID는 API 요청을 보내지 않음
    if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
      setIsLoading(false);
      setErrorMessage("올바르지 않은 영화 번호예요.");
      return;
    }

    setIsLoading(true);

    // 영화 ID로 TMDB 상세 정보 요청
    getMovieDetail(parsedMovieId)
      .then((response) => {
        if (!ignore) {
          setMovie(response);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setErrorMessage(getMovieDetailErrorMessage(error));
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    // 화면을 떠나거나 movieId가 바뀌면 이전 요청의 상태 변경을 막음
    return () => {
      ignore = true;
    };
  }, [parsedMovieId]);

  // API 요청 중
  if (isLoading) {
    return (
      <main className="px-4 py-20 text-center text-[#17191e]">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  // 잘못된 영화 ID 또는 API 요청 오류
  if (errorMessage) {
    return (
      <main className="px-4 py-20 text-center text-[#17191e]">
        <h1 className="text-[21px] font-bold">{errorMessage}</h1>
        <Link
          className="mt-4 inline-block text-[#2563eb] hover:underline"
          to="/"
        >
          영화 목록
        </Link>
      </main>
    );
  }

  // 오류도 없고 데이터도 없는 예외적인 경우
  if (!movie) {
    return null;
  }

  return <MovieDetail key={movie.id} movie={movie} />;
}

function MovieDetail({ movie }: { movie: TmdbMovieDetail }) {
  // TMDB의 이미지 경로를 실제 이미지 URL로 변환
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  // TMDB의 runtime은 분 단위이므로 시간과 분으로 변환
  const runtimeText =
    typeof movie.runtime === "number"
      ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
      : "상영 시간 정보가 없어요.";

  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  // 기존 평점/후기 기능
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [savedRating, setSavedRating] = useState<{
    rating: number;
    review: string;
  } | null>(null);
  const [ratingError, setRatingError] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSaveRating(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating === 0) {
      setRatingError(true);
      return;
    }

    setRatingError(false);
    setSaveError(null);

    // 백엔드에 평점 저장 요청
    try {
      await createRating(movie.id, {score: rating, comment: review.trim() || null});

      setSavedRating({
      rating,
      review: review.trim(),
      });
    } catch (error) {
      setSaveError(
        isHTTPError(error) && error.response.status === 409
        ? "이미 평점을 남긴 영화예요."
        : "평점을 저장하지 못했어요.",
      );
    }
    
  }

  return (
    <main className="bg-[#f6f7f9] text-[#17191e]">
      <section
        className="relative isolate flex h-[360px] flex-col justify-between overflow-hidden bg-[#17191e] px-4 py-6 text-white md:px-10 xl:px-20"
        aria-label="영화 정보"
      >
        {/* TMDB backdrop 이미지가 있을 때만 표시 */}
        {backdropUrl ? (
          <img
            className="absolute inset-0 -z-20 size-full object-cover object-center"
            src={backdropUrl}
            alt=""
            aria-hidden="true"
          />
        ) : null}

        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-black/55 via-black/15 to-transparent"
          aria-hidden="true"
        />

        <Link
          className="inline-flex w-fit items-center gap-1 text-[13px] font-bold leading-4 hover:underline"
          to="/"
        >
          <img
            className="size-6 brightness-0 invert"
            src="/icons/chevron-left.svg"
            alt=""
          />
          영화 목록
        </Link>

        <div className="flex w-full max-w-[800px] flex-col gap-2">
          <h1 className="text-[32px] font-bold leading-tight tracking-[-1.6px] md:text-[46px] md:leading-[49.68px] md:tracking-[-2.3px]">
            {movie.title}
          </h1>

          <p className="text-[14px] leading-[17px]">
            {movie.original_title}
          </p>

          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[13px] font-bold leading-4">
            <p>{movie.release_date}</p>

            {/* 장르 객체 배열에서 장르 이름만 추출 */}
            <p>
              {movie.genres.map((genre) => genre.name).join(", ")}
            </p>

            <p>{runtimeText}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-8 px-4 py-6 md:grid-cols-[200px_minmax(0,1fr)] md:px-10 xl:grid-cols-[200px_minmax(0,1fr)_360px] xl:px-20">
        {/* TMDB poster 이미지가 있을 때만 표시 */}
        {posterUrl ? (
          <img
            className="h-[286px] w-[200px] rounded-[10px] object-cover shadow-[0_12px_30px_0_rgb(12_15_20/0.12)]"
            src={posterUrl}
            alt={`${movie.title} 포스터`}
          />
        ) : (
          <div className="flex h-[286px] w-[200px] items-center justify-center rounded-[10px] bg-[#e3e6eb] text-[14px] text-[#969da8]">
            이미지 없음
          </div>
        )}

        <section
          className="flex min-w-0 flex-col items-start gap-3"
          aria-labelledby="synopsis-title"
        >
          <h2
            id="synopsis-title"
            className="text-[21px] font-bold leading-[25px] tracking-[-0.63px]"
          >
            {movie.tagline}
          </h2>

          <p className="whitespace-pre-line text-[14px] leading-6 text-[#606774]">
            {movie.overview}
          </p>

          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => toggleBookmark(movie.id)}
            className={cn(
              "inline-flex h-[42px] min-w-[107px] cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 text-[14px] font-extrabold leading-[17px] text-white",
              isBookmarked
                ? "border-[#1d4ed8] bg-[#1d4ed8]"
                : "border-white bg-[#2563eb]",
            )}
          >
            <img
              className="size-4"
              src={
                isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              alt=""
            />
            즐겨찾기
          </button>
        </section>

        {/* 기존 평점/후기 UI */}
        <form
          onSubmit={handleSaveRating}
          className="flex min-w-0 flex-col gap-2 border-t border-[#e3e6eb] pt-6 md:col-span-2 xl:col-span-1 xl:min-h-[294px] xl:border-l xl:border-t-0 xl:pl-[30px] xl:pt-0"
          aria-labelledby="rating-title"
        >
          <h2
            id="rating-title"
            className="text-[21px] font-bold leading-[25px] tracking-[-0.63px]"
          >
            내 평점
          </h2>

          <p
            id="rating-hint"
            className="text-[12px] leading-[14px] text-[#969da8]"
          >
            별점은 필수, 후기는 선택이에요.
          </p>

          <div
            className="flex gap-1"
            role="group"
            aria-label="영화 별점"
            aria-describedby="rating-hint"
          >
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
                  value <= rating
                    ? "border-[#2563eb] bg-[#2563eb]"
                    : "border-[#e3e6eb] bg-white",
                )}
              >
                <img
                  className={cn(
                    "size-6",
                    value <= rating
                      ? "brightness-0 invert"
                      : "opacity-60",
                  )}
                  src="/icons/star.svg"
                  alt=""
                />
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

          <button
            type="submit"
            className="h-[42px] w-full cursor-pointer rounded-lg border border-white bg-[#17191e] px-4 text-[14px] font-extrabold leading-[17px] text-white hover:bg-[#30343d]"
          >
            평점 저장
          </button>

          {ratingError && (
            <p role="alert" className="text-[12px] text-red-600">
              별점을 선택해 주세요.
            </p>
          )}

          {savedRating && (
            <p
              role="status"
              className="text-[12px] leading-5 text-[#606774]"
            >
              {savedRating.rating}
              {savedRating.review ? "점과 후기를" : "점을"} 저장했어요.
            </p>
          )}

          {saveError && (
            <p role="alert" className="text-[12px] text-red-600">
              {saveError}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}