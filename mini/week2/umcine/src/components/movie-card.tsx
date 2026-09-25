import type { Movie } from "../types/movie";
import "./movie-card.css";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-poster">
        <img src={movie.posterPath} alt={`${movie.title} 포스터`} />

        <button
          className={`bookmark-button ${movie.isBookmarked ? "active" : ""}`}
          type="button"
          aria-label="북마크"
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <h2 className="movie-title">{movie.title}</h2>
      <p className="movie-release-date">{movie.releaseDate}</p>
    </article>
  );
}