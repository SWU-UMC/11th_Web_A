import type { Movie } from '../types/movie';
import MovieCard from './movie-card';

// MovieGrid 컴포넌트 규칙 정의
interface MovieGridProps {
  movies: Movie[]; // 영화 배열
  onToggleBookmark: (id: number) => void; // 북마크 버튼 클릭 시 호출되는 함수
}

// MovieGrid 컴포넌트
export default function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  return (
    <section className="w-full">
      <h1 className="text-[28px] font-bold text-[#111111] mb-6">영화 목록</h1>
      <div className="grid grid-cols-5 gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onToggleBookmark={onToggleBookmark}/>
        ))}
      </div>
    </section>
  );
}
