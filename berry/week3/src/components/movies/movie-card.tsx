import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie.ts";
import { cn } from "../../utils/cn.ts";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <li
      key={movie.id}
      className={cn("relative overflow-hidden rounded-[10px] bg-white")}
    >
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <img
          className="object-cover aspect-square w-full"
          src={movie.posterPath}
          alt={movie.title}
        />
        <span className="text-base font-bold">{movie.title}</span>
        <div className="text-sm text-[#666]">{movie.releaseDate}</div>
      </Link>
      <button
        className={cn(
          "absolute top-0 right-0 flex items-center jusify-center p-2 rounded-lg transition-colors",
          movie.isBookmarked
            ? "bg-blue-600 text-white"
            : "bg-black/50 backdrop-blur-sm text-white",
        )}
        aria-pressed={movie.isBookmarked}
        onClick={() => onToggleBookmark(movie.id)}
      >
        {movie.isBookmarked ? (
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
