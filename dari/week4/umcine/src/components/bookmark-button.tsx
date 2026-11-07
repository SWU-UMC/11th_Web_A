import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "icon" | "text";
  className?: string;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function BookmarkButton({
  movieId,
  variant = "icon",
  className,
  activeLabel = "북마크 해제",
  inactiveLabel = "북마크 추가",
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  return (
    <button
      className={cn(
        variant === "icon"
          ? "grid size-8 place-items-center rounded-md border p-0"
          : "flex w-full items-center justify-center gap-2 rounded-md border py-3 text-sm font-bold",
        isBookmarked
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-gray-300 bg-white text-gray-900",
        className,
      )}
      type="button"
      aria-label={isBookmarked ? activeLabel : inactiveLabel}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        className="size-5"
        src={
          isBookmarked
            ? "/icons/movie-icons/bookmark.svg"
            : "/icons/movie-icons/bookmark-outline.svg"
        }
        alt=""
        aria-hidden="true"
      />
      {variant === "text" && (isBookmarked ? activeLabel : inactiveLabel)}
    </button>
  );
}
