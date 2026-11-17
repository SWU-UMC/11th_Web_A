import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { cn } from "../../utils/cn";
import { useFavoriteStatusQuery } from "../../hooks/use-favorite-status-query";
import { useMyRatingsQuery } from "../../hooks/use-my-ratings-query";
import {
  useDeleteRatingMutation,
  useSaveRatingMutation,
} from "../../hooks/use-rating-mutations";
import { useToggleFavoriteMutation } from "../../hooks/use-toggle-favorite-mutation";
import { useAuthStore } from "../../stores/auth-store";
import { isHTTPError } from "ky";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  // URL의 movieId는 문자열이므로 API 요청을 위해 숫자로 변환
  const parsedMovieId = Number(movieId);

  // 영화 ID가 0보다 큰 정수인지 확인해요.
  const isValidMovieId =
    Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  // TanStack Query로 영화 상세 API 요청과 캐시를 관리해요.
  const movieDetailQuery = useQuery({
    // 영화 ID별로 상세 데이터를 구분해서 캐시해요.
    queryKey: ["movies", "detail", parsedMovieId],

    // 현재 영화 ID로 TMDB 상세 정보를 요청해요.
    queryFn: () => getMovieDetail(parsedMovieId),

    // 유효한 영화 ID일 때만 API 요청을 실행해요.
    enabled: isValidMovieId,

    staleTime: 30 * 1000,   // 전역은 1분인데 상세 조회만 30초
  });

  const movie = movieDetailQuery.data;

  // 유효하지 않은 영화 ID는 API 요청보다 먼저 처리해요.
  if (!isValidMovieId) {
    return (
      <main className="px-4 py-20 text-center text-[#17191e]">
        <h1 className="text-[21px] font-bold">
          올바르지 않은 영화 번호예요.
        </h1>

        <Link
          className="mt-4 inline-block text-[#2563eb] hover:underline"
          to="/"
        >
          영화 목록
        </Link>
      </main>
    );
  }

  // 첫 상세 데이터를 가져오는 중이에요.
  if (movieDetailQuery.isPending) {
    return (
      <main className="px-4 py-20 text-center text-[#17191e]">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  // 상세 API 요청에 실패했어요.
  if (movieDetailQuery.isError) {
    return (
      <main className="px-4 py-20 text-center text-[#17191e]">
        <h1 className="text-[21px] font-bold">
          {getMovieDetailErrorMessage(movieDetailQuery.error)}
        </h1>

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

  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  // 즐겨찾기 여부는 서버에서 조회하고, 버튼을 누르면 등록 또는 해제해요.
  const favoriteStatusQuery = useFavoriteStatusQuery(movie.id);
  const toggleFavoriteMutation = useToggleFavoriteMutation(movie.id);
  const isBookmarked = favoriteStatusQuery.data?.isFavorite ?? false;

  const handleToggleFavorite = () => {
    if (!accessToken) {
      alert("로그인 후 즐겨찾기할 수 있어요.");
      navigate({ to: "/login" });
      return;
    }

    if (favoriteStatusQuery.isPending || toggleFavoriteMutation.isPending) return;

    toggleFavoriteMutation.mutate(isBookmarked);
  };

  // 내 평점 목록에서 현재 영화의 평점을 찾아요.
  const myRatingsQuery = useMyRatingsQuery();
  const myRating = myRatingsQuery.data?.find(
    (savedMyRating) => savedMyRating.movieId === movie.id,
  );

  // 입력 전에는 저장된 내 평점을 보여주고, 입력을 시작하면 입력값을 사용해요.
  const [ratingInput, setRatingInput] = useState<number | null>(null);
  const [reviewInput, setReviewInput] = useState<string | null>(null);
  const rating = ratingInput ?? myRating?.score ?? 0;
  const review = reviewInput ?? myRating?.comment ?? "";
  const queryClient = useQueryClient();
  const saveRatingMutation = useSaveRatingMutation();
  const deleteRatingMutation = useDeleteRatingMutation();
  const isRatingPending = saveRatingMutation.isPending || deleteRatingMutation.isPending;

  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [ratingError, setRatingError] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // 저장한 값이 화면에 그대로 보이도록 입력값을 비우고 서버 데이터를 표시해요.
  function resetRatingInputs() {
    setRatingInput(null);
    setReviewInput(null);
  }

  function handleSaveRating(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating === 0) {
      setRatingError(true);
      return;
    }

    if (isRatingPending) return;

    setRatingError(false);
    setSaveError(null);
    setSavedMessage(null);

    const comment = review.trim() || null;
    const isUpdate = myRating !== undefined;

    saveRatingMutation.mutate(
      {
        ratingId: myRating?.ratingId,
        movieId: movie.id,
        score: rating,
        comment,
      },
      {
        onSuccess: () => {
          resetRatingInputs();
          setSavedMessage(
            `${rating}${comment ? "점과 후기를" : "점을"} ${isUpdate ? "수정" : "저장"}했어요.`,
          );
        },
        onError: (error) => {
          if (isHTTPError(error) && error.response.status === 409) {
            // 이미 남긴 평점이 있는데 화면에 반영되지 않은 경우 목록을 다시 조회해요.
            queryClient.invalidateQueries({ queryKey: ["ratings", "member"] });
            setSaveError("이미 평점을 남긴 영화예요.");
            return;
          }

          setSaveError(
            isUpdate ? "평점을 수정하지 못했어요." : "평점을 저장하지 못했어요.",
          );
        },
      },
    );
  }

  function handleDeleteRating() {
    if (!myRating || isRatingPending) return;
    if (!confirm("내 평점을 삭제할까요?")) return;

    setSaveError(null);
    setSavedMessage(null);

    deleteRatingMutation.mutate(myRating.ratingId, {
      onSuccess: () => {
        resetRatingInputs();
        setSavedMessage("평점을 삭제했어요.");
      },
      onError: () => {
        setSaveError("평점을 삭제하지 못했어요.");
      },
    });
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
            disabled={toggleFavoriteMutation.isPending}
            onClick={handleToggleFavorite}
            className={cn(
              "inline-flex h-[42px] min-w-[107px] cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 text-[14px] font-extrabold leading-[17px] text-white disabled:cursor-wait disabled:opacity-70",
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

          {!accessToken ? (
            <p className="text-[13px] leading-5 text-[#606774]">
              로그인 후 평점을 남길 수 있어요.{" "}
              <Link to="/login" className="font-bold text-[#2563eb] underline underline-offset-2">
                로그인하기
              </Link>
            </p>
          ) : myRatingsQuery.isLoading ? (
            <p role="status" className="text-[13px] leading-5 text-[#606774]">
              내 평점을 불러오는 중이에요.
            </p>
          ) : myRating ? (
            <p role="status" className="text-[13px] leading-5 text-[#606774]">
              이 영화에 {myRating.score}점을 남겼어요.
            </p>
          ) : null}

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
                  setRatingInput(value);
                  setRatingError(false);
                  setSavedMessage(null);
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
              setReviewInput(event.target.value);
              setSavedMessage(null);
            }}
            className="h-[102px] w-full resize-none rounded-lg border border-[#e3e6eb] bg-white px-3 pb-[18px] pt-4 text-[13px] leading-[19.5px] placeholder:text-[#969da8] focus:border-[#2563eb] focus:outline-none"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!accessToken || isRatingPending}
              className="h-[42px] w-full cursor-pointer rounded-lg border border-white bg-[#17191e] px-4 text-[14px] font-extrabold leading-[17px] text-white hover:bg-[#30343d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saveRatingMutation.isPending
                ? "저장 중"
                : myRating
                  ? "평점 수정"
                  : "평점 저장"}
            </button>

            {myRating && (
              <button
                type="button"
                disabled={isRatingPending}
                onClick={handleDeleteRating}
                className="h-[42px] shrink-0 cursor-pointer rounded-lg border border-[#d92d20] bg-white px-4 text-[14px] font-extrabold leading-[17px] text-[#d92d20] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteRatingMutation.isPending ? "삭제 중" : "삭제"}
              </button>
            )}
          </div>

          {ratingError && (
            <p role="alert" className="text-[12px] text-red-600">
              별점을 선택해 주세요.
            </p>
          )}

          {savedMessage && (
            <p
              role="status"
              className="text-[12px] leading-5 text-[#606774]"
            >
              {savedMessage}
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