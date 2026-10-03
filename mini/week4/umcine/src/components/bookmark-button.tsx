import { cn } from "../utils/cn";
import { useBookmarkStore } from "../stores/bookmark-store";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  return (
    <button
        className={cn(
        "absolute right-[6px] top-[7.5px] flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[8px] border border-white bg-[#17191e] px-[6px] py-[7.5px]",
        isBookmarked
            ? "border-[#2563eb] bg-[#2563eb]"
            : "bg-[#17191e]",
        )}
        type="button"
        aria-label="북마크"
        onClick={() => toggleBookmark(movieId)}
    >
        <img
        className="h-[24px] w-[24px]"
        src={
            isBookmarked
            ? "/icons/bookmark.svg"
            : "/icons/bookmark-outline.svg"
        }
        alt=""
        />
    </button>
  );
}

