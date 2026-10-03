import { cn } from "../../utils/cn";
import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
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
            src={movie.posterPath} 
            alt={`${movie.title} 포스터`} 
          />
        </Link>

        <button
          className={cn(
            "absolute right-[6px] top-[7.5px] flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[8px] border border-white bg-[#17191e] px-[6px] py-[7.5px]",
            movie.isBookmarked
              ? "border-[#2563eb] bg-[#2563eb]"
              : "bg-[#17191e]",
          )}
          type="button"
          aria-label="북마크"
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="h-[24px] w-[24px]"
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <h2 
        className="m-0 pt-[5px] font-[Pretendard,sans-serif] text-[14px] font-extrabold leading-[17px] tracking-[0] text-[#17191e]"
      >
        {movie.title}
      </h2>

      <p 
        className="m-0 font-[Pretendard,sans-serif] text-[12px] font-normal leading-[14px] tracking-[0] text-[#969da8]"
      >
        {movie.releaseDate}
      </p>
    </article>
  );
}