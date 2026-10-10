import { useState, useEffect } from "react";
import Pagination from "./../../components/movies/pagination";
import MovieGrid from "./../../components/movies/movie-grid";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getMovies } from "../../api/movies/get-movies";

// 북마크 상태를 프론트엔드에서 관리하기 위해 타입을 확장
type MovieWithBookmark = TmdbMovieListItem & {
  isBookmarked?: boolean;
};

export function MovieListPage() {
  const [movies, setMovies] = useState<MovieWithBookmark[]>([]); // 전체 영화 목록 데이터 상태
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  // 북마크 버튼을 눌렀을 때 실행되는 함수
  const handleToggleBookmark = (id: number) => {
    setMovies((prevMovies) =>
      // 클릭한 영화의 id와 일치하는 영화 객체의 isBookmarked 속성을 반전시킴 (true <-> false)
      prevMovies.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  };

  // 페이지네이션 계산 (한 페이지에 10개의 영화만 표시)
  const totalPages = Math.ceil(movies.length / 10); // 전체 페이지 수 계산

  return (
    <div>
      {/* 메인 콘텐츠 */}
      <main className="flex-1 max-w-300 w-full mx-auto px-6 pt-8 pb-15">
        {/* 에러 발생 시 에러 메시지 출력 */}
        {errorMessage ? (
          <p className="py-20 text-center text-red-500">{errorMessage}</p>
        ) : isLoading ? (
          /* 로딩 중일 때 로딩 텍스트 출력 */
          <p className="py-20 text-center text-[#888]">
            영화 목록을 불러오는 중...
          </p>
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
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
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
