import type { TmdbMovie } from "../../api/movies/models.ts";
import { MovieCard } from "./movie-card.tsx";

interface MovieGridProps {
  movies: TmdbMovie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="max-w-[1440px] mx-auto px-6">
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ul>
    </div>
  );
}
