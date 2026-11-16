import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onBookmarkToggle: (id: number) => void;
}

function MovieCard({ movie, onBookmarkToggle }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="poster-wrapper">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
        <img
          src={movie.posterPath}
          alt={movie.title}
          className="movie-poster"
        />
        </Link>

        <button
          className={cn(
            "absolute right-2 top-2 rounded p-1.5 text-white border border-white",
            movie.isBookmarked ? "bg-blue-600" : "bg-black/60"
          )}
          onClick={() => onBookmarkToggle(movie.id)}
        >
          <img
            src={
              movie.isBookmarked
                ? "/movie-icons/bookmark.svg"
                : "/movie-icons/bookmark-outline.svg"
            }
            alt={movie.isBookmarked ? "북마크 해제" : "북마크"}
            className="brightness-0 invert"
          />
        </button>
      </div>

      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
      >
        <h3>{movie.title}</h3>
      </Link>
      
      <p>{movie.releaseDate}</p>
    </div>
  );
}

export default MovieCard;