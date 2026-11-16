import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { Link } from "@tanstack/react-router";

export function MyPage() {
  // 예시 데이터
  const [userInfo] = useState({
    nickname: "gs0428",
    email: "gwangsoo@cinemalab.kr",
  });

  // 즐겨찾기 영화 데이터
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const bookmarkedMovieQueries = useQueries({
    queries: bookmarkedMovieIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
    })),
  });
  const bookmarkedMovies = bookmarkedMovieQueries.flatMap((query) =>
    query.data ? [query.data] : [],
  );
  const isLoadingBookmarks = bookmarkedMovieQueries.some(
    (query) => query.isPending,
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* 1. 상단 타이틀 및 정보 수정 버튼 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">내 정보</h1>
        <Link to="/mypage/edit">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition text-sm">
            정보 수정
          </button>
        </Link>
      </div>

      {/* 2. 기본 정보 섹션 */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">기본 정보</h2>
        <div className="flex items-center gap-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {/* 프로필 아이콘 박스 */}
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
            <img src="../../public/icons/person.svg" className="w-10 h-10" />
          </div>

          {/* 닉네임 및 이메일 정보 */}
          <div className="flex gap-16">
            <div>
              <p className="text-xs text-gray-400 mb-1 font-medium">닉네임</p>
              <p className="text-base font-semibold text-gray-900">
                {userInfo.nickname}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1 font-medium">이메일</p>
              <p className="text-base font-semibold text-gray-900">
                {userInfo.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 내 즐겨찾기 섹션 */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">내 즐겨찾기</h2>

        {bookmarkedMovieIds.length === 0 ? (
          <p className="text-sm text-gray-500">즐겨찾기한 영화가 없어요.</p>
        ) : (
          <>
            {isLoadingBookmarks && (
              <p className="mb-4 text-sm text-gray-500">
                즐겨찾기한 영화를 불러오는 중이에요.
              </p>
            )}
            {bookmarkedMovies.length > 0 && (
              <MovieGrid movies={bookmarkedMovies} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
