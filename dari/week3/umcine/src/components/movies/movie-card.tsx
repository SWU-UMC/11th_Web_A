import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";
interface MovieCardProps {
  movie: Movie
  onToggleBookmark: (movieId: number) => void
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-200">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img className="size-full object-cover" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        </Link>

        <button
          className={cn(
            "absolute right-2 top-2 grid size-8 place-items-center rounded-md border p-0",
            movie.isBookmarked ? "border-blue-600 bg-blue-600" : "border-white bg-gray-900/80",
          )}
          type="button"
          aria-label={
            movie.isBookmarked ? '북마크 해제' : '북마크 추가'
          }
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={
              movie.isBookmarked
                ? '/icons/movie-icons/bookmark.svg'
                : '/icons/movie-icons/bookmark-outline.svg'
            }
            alt=""
            aria-hidden="true"
          />
        </button>
      </div>

      <h2 className="mt-2.5 mb-1 truncate text-[15px] font-bold">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link>
      </h2>
      <p className="m-0 text-xs text-gray-400">{movie.releaseDate}</p>
    </article>
  );
}
