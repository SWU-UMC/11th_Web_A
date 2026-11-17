import type { Movie } from '../../types/movie'
import { MovieCard } from './movie-card'

type MovieGridProps = { movies: Movie[]; onToggleBookmark: (id: number) => void }

export function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  return <div className="movie-grid">{movies.map((movie) => <MovieCard key={movie.id} movie={movie} onToggleBookmark={onToggleBookmark} />)}</div>
}
