import { useBookmarkStore } from "../stores/bookmark-store";

interface BookmarkButtonProps {
    //현재 영화의 ID
    movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
    //현재 북마크가 되어있는지 확인 
    const isBookmarked = useBookmarkStore((state) =>
        state.bookmarkedMovieIds.includes(movieId),
    );
    // Store에서 북마크 추가/해제 함수 가져오기 
    const toggleBookmark = useBookmarkStore(
        (state) => state.toggleBookmark,
    );

    return (
        <button 
        type="button" 
        onClick={() => toggleBookmark(movieId)}
        >
            {isBookmarked ? "북마크 해제" : "북마크 추가"}
        </button>
    );
}