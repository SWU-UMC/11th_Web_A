import {
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { useAuthStore } from "../../stores/auth-store";
import { Link } from "@tanstack/react-router";
import {
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getFavorites } from "../../api/favorites/get-favorites";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";


const MOVIES_PER_PAGE = 3;

export function MyPage() {
  const accessToken = useAuthStore(
  (state) => state.accessToken,
);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const updateMeMutation = useUpdateMeMutation();

  const [form, setForm] = useState({
    email: "",
    nickname: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const favoritesQuery = useQuery({
    queryKey: ["favorites", "list"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    staleTime: 30 * 1000,
    retry: false,
  });

  const favoriteMovieIds =
    favoritesQuery.data?.map(
      (favorite) => favorite.movieId,
    ) ?? [];

  const favoriteQueries = useQueries({
    queries: favoriteMovieIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const favoriteMovies = favoriteQueries.flatMap(
    (query) =>
      query.data ? [query.data] : [],
  );

  const isFavoritesLoading =
    favoritesQuery.isPending ||
    favoriteQueries.some(
      (query) => query.isPending,
    );

  const totalPages = Math.max(
    1,
    Math.ceil(favoriteMovies.length / MOVIES_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const visibleMovies = favoriteMovies.slice(
    (safeCurrentPage - 1) * MOVIES_PER_PAGE,
    safeCurrentPage * MOVIES_PER_PAGE,
  );

  const nickname = form.nickname.trim();
  const isNicknameValid =
    nickname.length >= 2 && nickname.length <= 12;

  const handleStartEdit = () => {
  if (!meQuery.data) {
    return;
  }

  setForm({
    email: meQuery.data.email,
    nickname: meQuery.data.nickname,
  });

  setIsEditing(true);
};

  const handleCancelEdit = () => {
    if (meQuery.data) {
      setForm({
        email: meQuery.data.email,
        nickname: meQuery.data.nickname,
      });
    }

    setIsEditing(false);
  };

  const handleProfileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("프로필 이미지는 5MB 이하만 선택할 수 있어요.");
      event.target.value = "";
      return;
    }

    setProfileImage(URL.createObjectURL(file));
  };

  const handleDuplicateCheck = () => {
    if (!isNicknameValid) {
      alert("닉네임은 2자 이상 12자 이하로 입력해 주세요.");
      return;
    }

    alert("사용할 수 있는 닉네임이에요.");
  };

  const handleSubmit = (
    event: SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!isNicknameValid) {
      return;
    }

    updateMeMutation.mutate(
      {
        nickname,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  if (!accessToken) {
  return (
    <main className="mx-auto w-[min(1160px,calc(100%-48px))] py-16">
      <p className="text-gray-500">
        로그인이 필요한 페이지예요.
      </p>

      <Link
        className="mt-4 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white"
        to="/login"
      >
        로그인하기
      </Link>
    </main>
  );
}

if (meQuery.isPending) {
  return (
    <main className="mx-auto w-[min(1160px,calc(100%-48px))] py-16">
      <p className="text-gray-500">
        회원 정보를 불러오는 중이에요.
      </p>
    </main>
  );
}

if (meQuery.isError || !meQuery.data) {
  return (
    <main className="mx-auto w-[min(1160px,calc(100%-48px))] py-16">
      <p className="text-red-600">
        회원 정보를 불러오지 못했어요.
      </p>
    </main>
  );
}

  if (isEditing) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col">
        <main className="mx-auto w-[min(1160px,calc(100%-48px))] flex-1 py-10 pb-20">
          <form onSubmit={handleSubmit}>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-[32px] leading-tight font-bold">
                  내 정보 수정
                </h1>

                <p className="mt-3 text-sm text-gray-500">
                  닉네임과 프로필 이미지만 변경할 수 있어요.
                </p>
              </div>

              <button
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
                type="submit"
                disabled={
                  !isNicknameValid ||
                  updateMeMutation.isPending
                }
              >
                {updateMeMutation.isPending
                  ? "저장 중"
                  : "변경사항 저장"}
              </button>
            </div>

            <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_1.45fr]">
              <section className="flex flex-col items-center pt-3">
                <label
                  className="group relative cursor-pointer"
                  htmlFor="profile-image"
                >
                  <span className="grid size-28 overflow-hidden rounded-full bg-gray-200">
                    {profileImage ? (
                      <img
                        className="size-full object-cover"
                        src={profileImage}
                        alt="프로필 미리보기"
                      />
                    ) : (
                      <img
                        className="m-auto size-11"
                        src="/icons/movie-icons/person.svg"
                        alt=""
                        aria-hidden="true"
                      />
                    )}
                  </span>

                  <span className="absolute right-0 bottom-0 grid size-8 place-items-center rounded-full border-2 border-gray-900 bg-white">
                    <img
                      className="size-4"
                      src="/icons/movie-icons/edit.svg"
                      alt=""
                      aria-hidden="true"
                    />
                  </span>
                </label>

                <input
                  id="profile-image"
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileChange}
                />

                <strong className="mt-4 text-base">
                  프로필 이미지
                </strong>
                <span className="mt-2 text-xs text-gray-400">
                  선택 사항 · 최대 5MB
                </span>
              </section>

              <section className="flex flex-col gap-7">
                <div>
                  <label
                    className="mb-2 block text-sm font-bold"
                    htmlFor="my-nickname"
                  >
                    닉네임
                  </label>

                  <div className="flex overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-blue-600">
                    <input
                      id="my-nickname"
                      className="min-w-0 flex-1 px-4 py-3 outline-none"
                      type="text"
                      value={form.nickname}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          nickname: event.target.value,
                        }))
                      }
                    />

                    <button
                      className="shrink-0 px-4 text-sm font-bold text-blue-600"
                      type="button"
                      onClick={handleDuplicateCheck}
                    >
                      중복 확인
                    </button>
                  </div>

                  {!isNicknameValid && (
                    <p className="mt-2 text-sm text-red-600">
                      닉네임은 2자 이상 12자 이하로 입력해
                      주세요.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-bold"
                    htmlFor="my-email"
                  >
                    이메일
                  </label>

                  <input
                    id="my-email"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-600 outline-none"
                    type="email"
                    value={form.email}
                    readOnly
                  />
                </div>

                <button
                  className="self-end text-sm font-medium text-gray-500 underline underline-offset-4"
                  type="button"
                  onClick={handleCancelEdit}
                >
                  수정 취소
                </button>
              </section>
            </div>
          </form>

          <section className="mt-28 flex items-center justify-between rounded-xl border border-red-300 bg-red-50 px-6 py-5">
            <div>
              <h2 className="font-bold text-red-600">
                회원 탈퇴
              </h2>
              <p className="mt-2 text-sm text-red-500">
                탈퇴하면 작성한 평점, 후기는 물론 즐겨찾기
                데이터도 삭제되며 복구할 수 없습니다.
              </p>
            </div>

            <button
              className="rounded-lg border border-red-500 bg-white px-5 py-3 text-sm font-bold text-red-600"
              type="button"
              onClick={() =>
                alert("회원 탈퇴 기능은 아직 연결되지 않았어요.")
              }
            >
              회원 탈퇴
            </button>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col">
      <main className="mx-auto w-[min(1160px,calc(100%-48px))] flex-1 py-10 pb-20">
        <div className="flex items-center justify-between">
          <h1 className="text-[32px] leading-tight font-bold">
            내 정보
          </h1>

          <button
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white"
            type="button"
            onClick={handleStartEdit}
          >
            정보 수정
          </button>
        </div>

        <section className="mt-8 border-y border-gray-200 py-7">
          <h2 className="text-lg font-bold">기본 정보</h2>

          <div className="mt-7 grid items-center gap-8 sm:grid-cols-[96px_1fr_1fr]">
            <span className="grid size-20 overflow-hidden rounded-full bg-gray-200">
              {profileImage ? (
                <img
                  className="size-full object-cover"
                  src={profileImage}
                  alt="프로필"
                />
              ) : (
                <img
                  className="m-auto size-9"
                  src="/icons/movie-icons/person.svg"
                  alt=""
                  aria-hidden="true"
                />
              )}
            </span>

            <div>
              <span className="text-sm text-gray-400">
                닉네임
              </span>
              <strong className="mt-2 block">
                {meQuery.data.nickname}
              </strong>
            </div>

            <div>
              <span className="text-sm text-gray-400">
                이메일
              </span>
              <strong className="mt-2 block">
                {meQuery.data.email}
              </strong>
            </div>
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-lg font-bold">내 즐겨찾기</h2>

          {isFavoritesLoading ? (
            <p className="mt-8 text-sm text-gray-500">
              즐겨찾기 영화를 불러오는 중이에요.
            </p>
          ) : favoritesQuery.isError ? (
            <p className="mt-8 text-sm text-red-600">
              즐겨찾기 목록을 불러오지 못했어요.
            </p>
          ) : favoriteMovieIds.length === 0 ? (
            <p className="mt-8 text-sm text-gray-500">
              즐겨찾기한 영화가 없어요.
            </p>
          ) : (
            <>
              <div className="mt-5 grid max-w-[700px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visibleMovies.map((movie) => {
                  const posterUrl = getTmdbPosterUrl(
                    movie.poster_path,
                  );

                  return (
                    <article key={movie.id} className="min-w-0">
                      <Link
                        to="/movies/$movieId"
                        params={{
                          movieId: String(movie.id),
                        }}
                      >
                        <div className="aspect-[2/3] overflow-hidden rounded-lg bg-gray-200">
                          {posterUrl ? (
                            <img
                              className="size-full object-cover"
                              src={posterUrl}
                              alt={`${movie.title} 포스터`}
                            />
                          ) : (
                            <div className="grid size-full place-items-center text-sm text-gray-500">
                              이미지 없음
                            </div>
                          )}
                        </div>

                        <h3 className="mt-2 truncate text-sm font-bold">
                          {movie.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">
                          {movie.release_date ||
                            "개봉일 정보 없음"}
                        </p>
                      </Link>
                    </article>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <nav
                  className="mt-8 flex max-w-[700px] items-center justify-center gap-3"
                  aria-label="즐겨찾기 페이지"
                >
                  <button
                    className="grid size-9 place-items-center rounded-lg disabled:text-gray-300"
                    type="button"
                    disabled={safeCurrentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.max(1, page - 1),
                      )
                    }
                  >
                    ‹
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      className={`grid size-9 place-items-center rounded-lg text-sm font-bold ${
                        page === safeCurrentPage
                          ? "bg-gray-900 text-white"
                          : "bg-white text-gray-600"
                      }`}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="grid size-9 place-items-center rounded-lg disabled:text-gray-300"
                    type="button"
                    disabled={safeCurrentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1),
                      )
                    }
                  >
                    ›
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="flex min-h-[58px] items-center justify-end gap-2 border-t border-gray-200 bg-white px-6 text-[11px] text-gray-400">
      <span className="font-bold text-cyan-500">TMDB</span>
      <span>
        This product uses the TMDB API but is not endorsed or
        certified by TMDB.
      </span>
    </footer>
  );
}