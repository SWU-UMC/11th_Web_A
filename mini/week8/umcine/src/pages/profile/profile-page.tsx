import { Link } from "@tanstack/react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getFavorites } from "../../api/favorites/get-favorites";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import MovieCard from "../../components/movies/movie-card";
import { useMeQuery } from "../../hooks/use-me-query";

const PAGE_SIZE = 10;

export function ProfilePage() {
  // (protected) Layout Route를 통과했으므로 이 페이지는 로그인한 상태에서만 열려요.
  const meQuery = useMeQuery();

  // 서버에는 영화 ID만 저장되어 있으므로, 목록을 받은 뒤 영화 정보는 TMDB 상세 query로 가져와요.
  const favoritesQuery = useQuery({
    queryKey: ["favorites", "list"],
    queryFn: getFavorites,
  });
  const movieIds = favoritesQuery.data?.map((favorite) => favorite.movieId) ?? [];
  const [requestedPage, setRequestedPage] = useState(1);
  const totalPages = Math.ceil(movieIds.length / PAGE_SIZE);
  const page = Math.min(requestedPage, Math.max(1, totalPages));
  const visibleIds = movieIds.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const favorites = useQueries({
    queries: visibleIds.map((id) => ({
      queryKey: ["movies", "detail", id],
      queryFn: () => getMovieDetail(id),
    })),
  });

  return (
    <main className="px-4 pb-10 pt-6 text-[#17191e] md:px-10 xl:px-20">
      <div className="flex min-h-[42px] items-center justify-between gap-4">
        <h1 className="text-[31px] font-bold leading-[37px] tracking-[-1.24px]">내 정보</h1>
        <Link
          to="/profile/edit"
          className="inline-flex h-[42px] items-center rounded-lg border border-white bg-[#2563eb] px-4 text-[14px] font-bold text-white no-underline"
        >
          정보 수정
        </Link>
      </div>

      <section aria-labelledby="profile-heading" className="mt-7 border-y border-[#e3e6eb] py-3">
        <h2 id="profile-heading" className="text-[17px] font-bold leading-5">기본 정보</h2>
        <div className="mt-4 flex items-center gap-4 sm:gap-7">
          <div className="flex size-[82px] shrink-0 items-center justify-center rounded-full bg-[#e3e6eb]">
            <img src="/icons/person.svg" alt="" className="size-12" />
          </div>
          {meQuery.isPending ? (
            <p role="status" className="text-[14px] text-[#606774]">내 정보를 불러오는 중이에요.</p>
          ) : meQuery.isError ? (
            <p role="alert" className="text-[14px] text-[#606774]">내 정보를 불러오지 못했어요.</p>
          ) : (
            <dl className="grid min-w-0 flex-1 gap-x-7 gap-y-3 sm:max-w-[760px] sm:grid-cols-2">
              <div>
                <dt className="text-[11px] leading-[13px] text-[#969da8]">닉네임</dt>
                <dd className="mt-1.5 text-[14px] font-bold leading-[17px]">{meQuery.data.nickname}</dd>
              </div>
              <div>
                <dt className="text-[11px] leading-[13px] text-[#969da8]">이메일</dt>
                <dd className="mt-1.5 text-[14px] font-bold leading-[17px] wrap-anywhere">{meQuery.data.email}</dd>
              </div>
            </dl>
          )}
        </div>
      </section>

      <section aria-labelledby="favorites-heading" className="mt-7">
        <h2 id="favorites-heading" className="mb-4 text-[17px] font-bold leading-5">내 즐겨찾기</h2>
        {favoritesQuery.isPending ? (
          <p role="status" className="text-sm text-[#606774]">즐겨찾기 목록을 불러오는 중이에요.</p>
        ) : favoritesQuery.isError ? (
          <p role="alert" className="text-sm text-[#606774]">즐겨찾기 목록을 불러오지 못했어요.</p>
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
