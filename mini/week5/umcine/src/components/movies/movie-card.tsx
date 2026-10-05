import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({movie}: MovieCardProps) {

  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <article className="flex w-full flex-col gap-1">
      
      <div className="relative h-[274px] w-full overflow-hidden rounded-[10px]">

        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full w-full"
        >
          {posterUrl ? (
            <img 
              className="block h-full w-full object-cover"
              src={posterUrl}
              alt={`${movie.title} 포스터`} 
            />   
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#e3e6eb] text-[14px] text-[#969da8]">
              이미지 없음
            </div>
          )}
        </Link>

        <BookmarkButton movieId={movie.id} />

      </div>

      <h2 
        className="m-0 pt-[5px] font-[Pretendard,sans-serif] text-[14px] font-extrabold leading-[17px] tracking-[0] text-[#17191e]"
      >
        {movie.title}
      </h2>

      <p 
        className="m-0 font-[Pretendard,sans-serif] text-[12px] font-normal leading-[14px] tracking-[0] text-[#969da8]"
      >
        {movie.release_date}
      </p>
    </article>
  );
}