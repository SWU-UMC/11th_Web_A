import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({movie}: MovieCardProps) {
  return (
    <article className="flex w-full flex-col gap-1">
      
      <div className="relative h-[274px] w-full overflow-hidden rounded-[10px]">

        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full w-full"
        >
          <img 
            className="block h-full w-full object-cover"
            src={movie.poster_path ?? ""}
            alt={`${movie.title} 포스터`} 
          />
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