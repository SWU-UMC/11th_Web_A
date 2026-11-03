import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <article className="min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-200">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          {posterUrl ? (
            <img
              className="size-full object-cover"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <div className="grid size-full place-items-center text-sm text-gray-500">
              이미지 없음
            </div>
          )}
        </Link>

        <BookmarkButton
          movieId={movie.id}
          className="absolute top-2 right-2"
        />
      </div>

      <h2 className="mt-2.5 mb-1 truncate text-[15px] font-bold">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          {movie.title}
        </Link>
      </h2>

      <p className="m-0 text-xs text-gray-400">
        {movie.release_date || "개봉일 정보 없음"}
      </p>
    </article>
  );
}