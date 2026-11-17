import { Link } from '@tanstack/react-router'
import type { Movie } from '../../types/movie'

type MovieCardProps = { movie: Movie; onToggleBookmark: (id: number) => void }

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-card__poster-wrap">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img className="movie-card__poster" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        </Link>
        <button type="button" className={`movie-card__bookmark${movie.isBookmarked ? ' movie-card__bookmark--active' : ''}`} aria-label={`${movie.title} 북마크`} aria-pressed={movie.isBookmarked} onClick={() => onToggleBookmark(movie.id)}>
          <img src={`/icons/movie-icons/movie-icons/${movie.isBookmarked ? 'bookmark' : 'bookmark-outline'}.svg`} alt="" />
        </button>
      </div>
      <h2 className="movie-card__title">{movie.title}</h2>
      <time className="movie-card__date" dateTime={movie.releaseDate.replaceAll('.', '-')}>{movie.releaseDate}</time>
    </article>
  )
}
