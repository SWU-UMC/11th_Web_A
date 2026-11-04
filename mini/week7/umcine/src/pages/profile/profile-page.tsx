import { Link, useLocation } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import MovieCard from "../../components/movies/movie-card";
import { useBookmarkStore } from "../../stores/bookmark-store";

const PAGE_SIZE = 10;

export function ProfilePage() {
  // TODO: 로그인 API 연결 후 로그인 상태에 따라 기본 정보와 즐겨찾기를 표시해요.
  // 개발용 미리보기 조건(isPreview, ?preview=signed-in)은 제거하고 실제 로그인 상태로 분기해요.
  // 예시 닉네임과 이메일을 실제 계정 정보로 교체하고, 해당 계정의 즐겨찾기를 보여줘요.
  // 로그인 전에는 “로그인 후 즐겨찾기를 확인할 수 있어요.”를 표시해요.
  const search = useLocation({ select: (location) => location.searchStr });
  const isPreview = import.meta.env.DEV && new URLSearchParams(search).get("preview") === "signed-in";
  const movieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const [requestedPage, setRequestedPage] = useState(1);
  const totalPages = Math.ceil(movieIds.length / PAGE_SIZE);
  const page = Math.min(requestedPage, Math.max(1, totalPages));
  const visibleIds = movieIds.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const favorites = useQueries({
    queries: (isPreview ? visibleIds : []).map((id) => ({
      queryKey: ["movies", "detail", id],
      queryFn: () => getMovieDetail(id),
    })),
  });

  return (
    <main className="px-4 pb-10 pt-6 text-[#17191e] md:px-10 xl:px-20">
      <div className="flex min-h-[42px] items-center justify-between gap-4">
        <h1 className="text-[31px] font-bold leading-[37px] tracking-[-1.24px]">내 정보</h1>
        {/* TODO: 내 정보 수정 화면이 추가되면 이동을 연결해요. */}
        {isPreview && (
          <button
            type="button"
            disabled
            className="h-[42px] rounded-lg border border-white bg-[#2563eb] px-4 text-[14px] font-bold text-white"
          >
            정보 수정
          </button>
        )}
      </div>

      <section aria-labelledby="profile-heading" className="mt-7 border-y border-[#e3e6eb] py-3">
        <h2 id="profile-heading" className="text-[17px] font-bold leading-5">기본 정보</h2>
        <div className="mt-4 flex items-center gap-4 sm:gap-7">
          <div className="flex size-[82px] shrink-0 items-center justify-center rounded-full bg-[#e3e6eb]">
            <img src="/icons/person.svg" alt="" className="size-12" />
          </div>
          {isPreview ? (
            <dl className="grid min-w-0 flex-1 gap-x-7 gap-y-3 sm:max-w-[760px] sm:grid-cols-2">
              <div>
                <dt className="text-[11px] leading-[13px] text-[#969da8]">닉네임</dt>
                <dd className="mt-1.5 text-[14px] font-bold leading-[17px]">gs0428</dd>
              </div>
              <div>
                <dt className="text-[11px] leading-[13px] text-[#969da8]">이메일</dt>
                <dd className="mt-1.5 text-[14px] font-bold leading-[17px] wrap-anywhere">gs0428@example.com</dd>
              </div>
            </dl>
          ) : (
            <div className="min-w-0 text-[14px] leading-5">
              <p className="text-[#606774]">로그인 후 내 정보를 확인할 수 있어요.</p>
              <Link to="/login" className="mt-1.5 inline-block font-bold text-[#2563eb] underline underline-offset-2">
                로그인하기
              </Link>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="favorites-heading" className="mt-7">
        <h2 id="favorites-heading" className="mb-4 text-[17px] font-bold leading-5">내 즐겨찾기</h2>
        {!isPreview ? (
          <p className="text-sm text-[#606774]">로그인 후 즐겨찾기를 확인할 수 있어요.</p>
        ) : totalPages === 0 ? (
          <p className="text-sm text-[#606774]">아직 즐겨찾기한 영화가 없어요.</p>
        ) : (
          <>
            {favorites.some((favorite) => favorite.isPending) && (
              <p role="status" className="mb-4 text-sm text-[#606774]">즐겨찾기를 불러오는 중이에요.</p>
            )}
            {favorites.some((favorite) => favorite.isError) && (
              <p role="status" className="mb-4 text-sm text-[#606774]">일부 영화를 불러오지 못했어요.</p>
            )}
            <div className="grid grid-cols-1 gap-x-[18px] gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {favorites.map(({ data }) => data && <MovieCard key={data.id} movie={data} />)}
            </div>

            <nav aria-label="즐겨찾기 페이지" className="mt-9 flex items-center justify-center gap-3">
              <button
                type="button"
                aria-label="이전 페이지"
                disabled={page === 1}
                onClick={() => setRequestedPage(page - 1)}
                className="flex size-6 items-center justify-center disabled:opacity-30"
              >
                <img src="/icons/chevron-left.svg" alt="" className="size-4" />
              </button>
              <span aria-current="page" className="flex size-9 items-center justify-center rounded-lg bg-[#17191e] text-[14px] font-bold text-white">
                {page}
              </span>
              <button
                type="button"
                aria-label="다음 페이지"
                disabled={page === totalPages}
                onClick={() => setRequestedPage(page + 1)}
                className="flex size-6 items-center justify-center disabled:opacity-30"
              >
                <img src="/icons/chevron-right.svg" alt="" className="size-4" />
              </button>
            </nav>
          </>
        )}
      </section>
    </main>
  );
}
