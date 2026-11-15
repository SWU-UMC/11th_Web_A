import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import { getTmdbPosterUrl } from "@/utils/movies/tmdb-image";
import { cn } from "@/utils/cn";
import { Footer } from "@/components/layout/footer";
import { ProfileAvatar } from "@/components/my-page/profile-avatar";

const PAGE_SIZE = 10;

export function MyPage() {
  const user = useAuthStore((state) => state.user);
  const bookmarkedIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(bookmarkedIds.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages); // 즐겨찾기 해제로 페이지가 줄어든 경우 보정
  const pageIds = bookmarkedIds.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const movieQueries = useQueries({
    queries: pageIds.map((id) => ({
      queryKey: ["movies", "detail", id], // 영화 상세 페이지와 같은 키 → 캐시 공유
      queryFn: () => getMovieDetail(id),
    })),
  });

  if (!user) return null; // 라우트 가드(requireAuth)가 먼저 처리

  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col bg-gray-50">
      <main className="mx-auto w-full max-w-300 flex-1 px-6 pt-8 pb-16">
        {/* 제목 + 정보 수정 버튼 */}
        <div className="flex items-center justify-between pb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            내 정보
          </h1>
          <Link
            to="/my_page/edit"
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white no-underline transition-colors hover:bg-blue-700"
          >
            정보 수정
          </Link>
        </div>

        {/* 기본 정보 */}
        <section className="border-y border-gray-200 py-6">
          <h2 className="mb-5 text-lg font-bold text-gray-900">기본 정보</h2>
          <div className="flex items-center gap-12">
            <ProfileAvatar src={user.profileImage} />
            <dl className="grid flex-1 grid-cols-2">
              <div>
                <dt className="text-xs text-gray-400">닉네임</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {user.nickname}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">이메일</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {user.email}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* 내 즐겨찾기 */}
        <section className="pt-8">
          <h2 className="mb-5 text-lg font-bold text-gray-900">내 즐겨찾기</h2>

          {bookmarkedIds.length === 0 ? (
            <p className="py-16 text-center text-gray-400">
              아직 즐겨찾기한 영화가 없어요.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-5 gap-5">
                {movieQueries.map((query, index) => {
                  const movie = query.data;
                  if (!movie) {
                    // 로딩/실패 시 자리 유지용 스켈레톤
                    return (
                      <div
                        key={pageIds[index]}
                        className="aspect-2/3 animate-pulse rounded-xl bg-gray-200"
                      />
                    );
                  }
                  return (
                    <Link
                      key={movie.id}
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="flex flex-col no-underline"
                    >
                      <div className="aspect-2/3 w-full overflow-hidden rounded-xl bg-gray-200">
                        <img
                          src={getTmdbPosterUrl(movie.poster_path) ?? undefined}
                          alt={`${movie.title} 포스터`}
                          className="size-full object-cover"
                        />
                      </div>
                      <h3 className="mt-2.5 mb-1 truncate text-sm font-bold text-gray-900">
                        {movie.title}
                      </h3>
                      <p className="text-[13px] text-gray-400">
                        {movie.release_date.replaceAll("-", ".")}
                      </p>
                    </Link>
                  );
                })}
              </div>

              {/* 페이지네이션 */}
              <nav className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  aria-label="이전 페이지"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                  className="flex size-9 items-center justify-center disabled:opacity-40"
                >
                  <img src="/icons/chevron-left.svg" alt="" className="size-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg text-sm font-semibold text-gray-600",
                      currentPage === p && "bg-gray-900 text-white",
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label="다음 페이지"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(currentPage + 1)}
                  className="flex size-9 items-center justify-center disabled:opacity-40"
                >
                  <img src="/icons/chevron-right.svg" alt="" className="size-5" />
                </button>
              </nav>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
