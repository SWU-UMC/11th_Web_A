import { useState } from 'react';
import Header from './components/header';
import MovieGrid from './components/movie-grid';
import Pagination from './components/pagination';
import Footer from './components/footer';
import { movies as initialMovies } from './data/movies';

export default function App() {
  const [movies, setMovies] = useState(initialMovies); // 전체 영화 목록 데이터 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

  // 북마크 버튼을 눌렀을 때 실행되는 함수
  const handleToggleBookmark = (id: number) => {
    setMovies((prevMovies) =>
      // 클릭한 영화의 id와 일치하는 영화 객체의 isBookmarked 속성을 반전시킴 (true <-> false)
      prevMovies.map((movie) =>
        movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie
      )
    );
  };

  // 페이지네이션 계산 (한 페이지에 10개의 영화만 표시)
  const totalPages = Math.ceil(movies.length / 10); // 전체 페이지 수 계산
  const startIndex = (currentPage - 1) * 10; // 현재 페이지의 시작 인덱스
  const currentMovies = movies.slice(startIndex, startIndex + 10); // 현재 페이지에 보여줄 10개 영화만 자르기

  return (
    <div className="app-container">
       {/* 상단 헤더 */}
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="main-content">

        {/* 영화 리스트(그리드 형태) - 현재 페이지의 10개 영화만 보여주기 */}
        <MovieGrid movies={currentMovies} onToggleBookmark={handleToggleBookmark} />
        
        {/* 페이지가 1개 이상 있을 때만 페이지네이션 컴포넌트 추가 */}
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      {/* 하단 footer (TMDB 로고 및 정보) */}
      <Footer />
    </div>
  );
}
