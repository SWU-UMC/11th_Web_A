import { Link } from "@tanstack/react-router";
import { ListBookmarkButton } from "../list-bookmark-button";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

// MovieCard 컴포넌트 규칙
interface MovieCardProps {
  movie: TmdbMovieListItem; // 영화 객체
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
          src={getTmdbPosterUrl(movie.poster_path) ?? undefined}
          alt={`${movie.title} 포스터`}
          className="w-full h-full object-cover block"
        />
        <ListBookmarkButton movieId={movie.id} />
      </div>
      <div className="mt-2.5">
        <h3 className="text-sm font-bold text-[#111111] truncate mb-1">
          {movie.title}
        </h3>
        <p className="text-[13px] text-[#888888]">{movie.release_date}</p>
      </div>
    </Link>
  );
}
