import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { toMovie } from "../../utils/movies/to-movie";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { ProfileAvatar } from "../../components/profile-avatar";
import { useAuthStore } from "../../stores/auth-store";
import { useBookmarkStore } from "../../stores/bookmark-store";
import "../movies/movie-list-page.css";
import "./my-page.css";

// 한 페이지에 보여줄 즐겨찾기 영화 수
const PAGE_SIZE = 10;

export function MyPage() {
  const user = useAuthStore((state) => state.user);
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(bookmarkedMovieIds.length / PAGE_SIZE));
  // 북마크를 해제해서 페이지 수가 줄어들면 마지막 페이지로 맞춤
  const page = Math.min(currentPage, totalPages);
  const pageIds = bookmarkedMovieIds.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 현재 페이지에 있는 영화의 상세 정보를 각각 조회
  const movieQueries = useQueries({
    queries: pageIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
    })),
  });

  const isLoading = movieQueries.some((query) => query.isPending);
  const isError = movieQueries.some((query) => query.isError);
  const movies = movieQueries.flatMap((query) => (query.data ? [toMovie(query.data, true)] : []));

  if (!user) return null;

  return (
    <>
      <main className="my-page">
        <div className="my-page__inner">
          <div className="my-page__heading">
            <h1>내 정보</h1>
            <Link className="my-page__primary-button" to="/mypage/edit">정보 수정</Link>
          </div>

          <section className="my-page__section" aria-labelledby="my-page-profile">
            <h2 id="my-page-profile">기본 정보</h2>
            <div className="my-page__profile">
              <ProfileAvatar src={user.profileImage} />
              <dl className="my-page__info">
                <div><dt>닉네임</dt><dd>{user.nickname}</dd></div>
                <div><dt>이메일</dt><dd>{user.email}</dd></div>
              </dl>
            </div>
          </section>

          <section className="my-page__section" aria-labelledby="my-page-bookmarks">
            <h2 id="my-page-bookmarks">내 즐겨찾기</h2>
            {bookmarkedMovieIds.length === 0 ? (
              <p className="my-page__empty">아직 즐겨찾기한 영화가 없어요.</p>
            ) : isLoading ? (
              <p className="my-page__empty">즐겨찾기를 불러오는 중이에요.</p>
            ) : isError ? (
              <p className="my-page__empty">즐겨찾기를 불러오지 못했어요.</p>
            ) : (
              <>
                <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setCurrentPage} alwaysShow />
              </>
            )}
          </section>
        </div>
      </main>

      <footer className="movie-footer">
        <div className="movie-footer__inner">
          <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
          <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
        </div>
      </footer>
    </>
  );
}
