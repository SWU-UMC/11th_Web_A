import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "../bookmark-button";
import type { Movie } from "../../types/movie";
interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-200">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img className="size-full object-cover" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        </Link>

        <BookmarkButton movieId={movie.id} className="absolute right-2 top-2" />
      </div>

      <h2 className="mt-2.5 mb-1 truncate text-[15px] font-bold">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link>
      </h2>
      <p className="m-0 text-xs text-gray-400">{movie.releaseDate}</p>
    </article>
  );
}
