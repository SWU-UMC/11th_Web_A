import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid";
import { getMovies } from "../../api/movies/get-movies";

export function MovieListPage() {
  
  // 현재 페이지 번호를 관리해요.
  const [page, setPage] = useState(1);

  // TanStack Query로 영화 목록 API 요청과 캐시를 관리해요.
  const moviesQuery = useQuery({
    // 페이지 번호를 queryKey에 포함해 페이지별로 데이터를 구분하고 캐시해요.
    queryKey: ["movies", "list", { page }],

    // 현재 페이지의 영화 목록을 요청해요.
    queryFn: () => getMovies({ page }),
  });

  // API 응답이 아직 없으면 빈 배열을 사용해요.
  const movies = moviesQuery.data?.results ?? [];

  // TMDB에서 제공하는 전체 페이지 수를 가져와요.
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  // 페이지 번호가 변경되면 현재 페이지를 변경해요.
  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <main className="bg-[#f6f7f9] px-4 py-6 md:px-10 xl:px-20">
      <h1 className="m-0 mb-5 text-left font-[Pretendard,sans-serif] text-[38px] font-bold leading-[44px] tracking-[-1.71px] text-[#17191e]">
        영화 목록
      </h1>

      {/* 영화 목록 상태에 따라 화면을 다르게 보여줘요. */}
      {moviesQuery.isPending ? (
        <p>영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p>{moviesQuery.error.message}</p>
      ) : movies.length === 0 ? (
        <p>조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          {/* 영화 카드 목록 */}
          <MovieGrid movies={movies} />

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <nav
              className="mt-8 flex items-center justify-center gap-4"
              aria-label="영화 목록 페이지"
            >
              {/* 이전 페이지 버튼 */}
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                aria-label="이전 페이지"
                className="cursor-pointer text-[24px] text-[#606774] disabled:cursor-default disabled:opacity-30"
              >
                ‹
              </button>

              {/* 페이지 번호 */}
              <div className="flex items-center gap-4">
                {Array.from(
                  { length: Math.min(totalPages, 5) },
                  (_, index) => index + 1,
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => handlePageChange(pageNumber)}
                    aria-current={
                      page === pageNumber ? "page" : undefined
                    }
                    className={
                      page === pageNumber
                        ? "flex size-9 cursor-pointer items-center justify-center rounded-lg bg-[#17191e] text-[14px] font-bold text-white"
                        : "flex size-9 cursor-pointer items-center justify-center text-[14px] text-[#606774]"
                    }
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              {/* 다음 페이지 버튼 */}
              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                aria-label="다음 페이지"
                className="cursor-pointer text-[24px] text-[#606774] disabled:cursor-default disabled:opacity-30"
              >
                ›
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}