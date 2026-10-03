import type { Movie } from "../types/movie";
import { Link } from '@tanstack/react-router';
import { cn } from './../../utils/cn';

// MovieCard 컴포넌트 규칙
interface MovieCardProps {
  movie: Movie; // 영화 객체
  onToggleBookmark: (id: number) => void; // 북마크 버튼 클릭 시 호출되는 함수
}

// MovieCard 컴포넌트
export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="flex flex-col no-underline">
      <div className="relative w-full aspect-2/3 rounded-xl overflow-hidden bg-gray-200">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="w-full h-full object-cover block"
        />

        <button
          type="button"
          className={cn("absolute top-2.5 right-2.5 w-9 h-9 flex items-center justify-center rounded-lg bg-black/40 transition-colors", movie.isBookmarked && "bg-blue-600")}
          onClick={() => onToggleBookmark(movie.id)}
        >

          {/* 북마크 상태면 채워진 아이콘, 아니면 테두리 아이콘 표시 */}
          {movie.isBookmarked ? (
            <img
              src="/icons/bookmark.svg"
              alt="북마크된 영화"
              className="w-5 h-5 invert brightness-0"
            />
          ) : (
            <img
              src="/icons/bookmark-outline.svg"
              alt="북마크 안 된 영화"
              className="w-5 h-5 invert brightness-0"
            />
          )}
        </button>
      </div>
      <div className="mt-2.5">
        <h3 className="text-sm font-bold text-[#111111] truncate mb-1">{movie.title}</h3>
        <p className="text-[13px] text-[#888888]">{movie.releaseDate}</p>
      </div>
    </Link>
  );
}
