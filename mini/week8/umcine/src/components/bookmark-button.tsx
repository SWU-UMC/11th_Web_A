import { useNavigate } from "@tanstack/react-router";
import { useFavoritesQuery } from "../hooks/use-favorites-query";
import { useToggleFavoriteMutation } from "../hooks/use-toggle-favorite-mutation";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  // 카드마다 여부를 따로 요청하지 않고, 내 즐겨찾기 목록 하나로 표시해요.
  const favoritesQuery = useFavoritesQuery();
  const toggleFavoriteMutation = useToggleFavoriteMutation(movieId);
  const isBookmarked =
    favoritesQuery.data?.some((favorite) => favorite.movieId === movieId) ?? false;

  const handleClick = () => {
    if (!accessToken) {
      alert("로그인 후 즐겨찾기할 수 있어요.");
      navigate({ to: "/login" });
      return;
    }

    if (favoritesQuery.isPending || toggleFavoriteMutation.isPending) return;

    toggleFavoriteMutation.mutate(isBookmarked);
  };

  return (
    <button
        className={cn(
        "absolute right-[6px] top-[7.5px] flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[8px] border border-white bg-[#17191e] px-[6px] py-[7.5px] disabled:cursor-wait",
        isBookmarked
            ? "border-[#2563eb] bg-[#2563eb]"
            : "bg-[#17191e]",
        )}
        type="button"
        aria-label="북마크"
        aria-pressed={isBookmarked}
        disabled={toggleFavoriteMutation.isPending}
        onClick={handleClick}
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
