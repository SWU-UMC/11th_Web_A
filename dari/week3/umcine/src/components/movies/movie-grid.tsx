import type { Movie } from '../../types/movie'
import MovieCard from './movie-card'

interface MovieGridProps {
  movies: Movie[]
  onToggleBookmark: (movieId: number) => void
}

export default function MovieGrid({
  movies,
  onToggleBookmark,
}: MovieGridProps) {
  return (
    <section className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" aria-label="영화 목록">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </section>
  )
}
