import { useState } from "react";
import Pagination from "./../../components/movies/pagination";
import MovieGrid from "./../../components/movies/movie-grid";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getMovies } from "../../api/movies/get-movies";
import { useQuery } from "@tanstack/react-query";

// 북마크 상태를 프론트엔드에서 관리하기 위해 타입을 확장
type MovieWithBookmark = TmdbMovieListItem & {
  isBookmarked?: boolean;
};

export function MovieListPage() {
  const [page, setPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const rawMovies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const movies: MovieWithBookmark[] = rawMovies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedIds.includes(movie.id),
  }));

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  // 북마크 버튼을 눌렀을 때 실행되는 함수
  const handleToggleBookmark = (id: number) => {
    setBookmarkedIds(
      (prev) =>
        prev.includes(id)
          ? prev.filter((bookmarkId) => bookmarkId !== id) // 이미 북마크 되어있다면 제거
          : [...prev, id], // 아니면 추가
    );
  };

  return (
    <div>
      {/* 메인 콘텐츠 */}
      <main className="flex-1 max-w-300 w-full mx-auto px-6 pt-8 pb-15">
        {/* 데이터를 가져오는 중인지, 오류가 발생했는지 순서대로 확인 */}
        {moviesQuery.isPending ? (
          <p>영화를 불러오는 중이에요.</p> // 기존 로딩 UI가 있다면 재사용
        ) : moviesQuery.isError ? (
          <p>{moviesQuery.error.message}</p> // 기존 오류 UI가 있다면 재사용
        ) : movies.length === 0 ? (
          <p>표시할 영화가 없어요.</p> // 기존 빈 목록 UI가 있다면 재사용
        ) : (
          <>
            {/* 영화 리스트(그리드 형태) - 현재 페이지의 10개 영화만 보여주기 */}
            <MovieGrid
              movies={movies}
              onToggleBookmark={handleToggleBookmark}
            />

            {/* 페이지가 1개 이상 있을 때만 페이지네이션 컴포넌트 추가 */}
            {totalPages > 0 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>

      {/* 하단 footer (TMDB 로고 및 정보) */}
      <footer className="w-full bg-white border-t border-[#eaeaea] py-5 mt-auto">
        <div className="max-w-300 mx-auto px-6 flex items-center justify-end gap-2">
          <img
            src="/images/logos/tmdb-logo.svg"
            alt="TMDB 로고"
            className="h-3"
          />
          <span className="text-xs text-[#888888]">
            This product uses the TMDB API but is not endorsed or certified by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              className="text-xs text-[#888888]"
            >
              TMDB
            </a>
            .
          </span>
        </div>
      </footer>
    </div>
  );
}
