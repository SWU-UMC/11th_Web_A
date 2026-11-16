import { Link } from "@tanstack/react-router";
import type { TmdbMovie } from "../../api/movies/models.ts";
import { cn } from "../../utils/cn.ts";
import { useBookmarkStore } from "../../stores/bookmark-store.ts";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image.ts";

interface MovieCardProps {
  movie: TmdbMovie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  return (
    <li
      key={movie.id}
      className={cn("relative overflow-hidden rounded-[10px] bg-white")}
    >
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <div className="aspect-square w-full bg-gray-200">
          {posterUrl ? (
            <img
              className="h-full w-full object-cover"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              포스터 없음
            </div>
          )}
        </div>
        <span className="text-base font-bold">{movie.title}</span>
        <div className="text-sm text-[#666]">{movie.release_date}</div>
      </Link>
      <button
        className={cn(
          "absolute top-0 right-0 flex items-center jusify-center p-2 rounded-lg transition-colors",
          isBookmarked
            ? "bg-blue-600 text-white"
            : "bg-black/50 backdrop-blur-sm text-white",
        )}
        aria-pressed={isBookmarked}
        onClick={() => toggleBookmark(movie.id)}
      >
        {isBookmarked ? (
          <img
            src="../../../public/icons/bookmark.svg"
            alt="북마크됨"
            className="w-4 h-4 brightness-0 invert"
          />
        ) : (
          <img
            src="../../../public/icons/bookmark-outline.svg"
            alt="북마크 안됨"
            className="w-4 h-4 brightness-0 invert"
          />
        )}
      </button>
    </li>
  );
}
