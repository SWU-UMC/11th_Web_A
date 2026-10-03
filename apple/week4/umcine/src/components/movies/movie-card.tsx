import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { ListBookmarkButton } from "../list-bookmark-button";

// MovieCard 컴포넌트 규칙
interface MovieCardProps {
  movie: Movie; // 영화 객체
  onToggleBookmark: (id: number) => void; // 북마크 버튼 클릭 시 호출되는 함수
}

// MovieCard 컴포넌트
export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      to="/movies/$movieId"
      params={{ movieId: String(movie.id) }}
      className="flex flex-col no-underline"
    >
      <div className="relative w-full aspect-2/3 rounded-xl overflow-hidden bg-gray-200">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="w-full h-full object-cover block"
        />
        <ListBookmarkButton movieId={movie.id} />
      </div>
      <div className="mt-2.5">
        <h3 className="text-sm font-bold text-[#111111] truncate mb-1">
          {movie.title}
        </h3>
        <p className="text-[13px] text-[#888888]">{movie.releaseDate}</p>
      </div>
    </Link>
  );
}
