import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
}

export default function MovieGrid({movies}: MovieGridProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-x-[18px] gap-y-[20px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}
    </div>
  );
}