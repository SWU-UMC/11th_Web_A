import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";
import type { BookmarkButtonProps } from "../types/bookmark-button";

export function DetailBookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      className={cn(
        "w-28 h-9 flex items-center justify-center gap-x-2 rounded-lg bg-blue-600",
        isBookmarked && "bg-blue-600",
      )}
      onClick={() => toggleBookmark(movieId)}
    >
      {isBookmarked ? (
        <img
          src="/icons/bookmark.svg"
          alt="북마크된 영화"
          className="w-5 h-5 invert brightness-0"
        />
      ) : (
        <img
          src="/icons/bookmark-outline.svg"
          alt="북마크 안 된 영화"
          className="w-5 h-5 invert brightness-0"
        />
      )}
      <span className="text-white font-medium">즐겨찾기</span>
    </button>
  );
}
