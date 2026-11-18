import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFavorite } from "../api/favorites/create-favorite";
import { deleteFavorite } from "../api/favorites/delete-favorite";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import { useAuthStore } from "../stores/auth-store";
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
  const queryClient = useQueryClient();

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const favoriteStatusQuery = useQuery({
    queryKey: [
      "favorites",
      "status",
      movieId,
    ],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken),
    staleTime: 30 * 1000,
    retry: false,
  });

  const createFavoriteMutation = useMutation({
    mutationFn: () =>
      createFavorite({
        movieId,
      }),

    onSuccess: () => {
      queryClient.setQueryData(
        ["favorites", "status", movieId],
        {
          isFavorite: true,
        },
      );

      queryClient.invalidateQueries({
        queryKey: ["favorites", "list"],
      });
    },

    onError: () => {
      alert("즐겨찾기 등록에 실패했어요.");
    },
  });

  const deleteFavoriteMutation = useMutation({
    mutationFn: () => deleteFavorite(movieId),

    onSuccess: () => {
      queryClient.setQueryData(
        ["favorites", "status", movieId],
        {
          isFavorite: false,
        },
      );

      queryClient.invalidateQueries({
        queryKey: ["favorites", "list"],
      });
    },

    onError: () => {
      alert("즐겨찾기 해제에 실패했어요.");
    },
  });

  const isFavorite =
    favoriteStatusQuery.data?.isFavorite ?? false;

  const isMutating =
    createFavoriteMutation.isPending ||
    deleteFavoriteMutation.isPending;

  const handleClick = () => {
    if (!accessToken) {
      alert("로그인 후 즐겨찾기를 사용할 수 있어요.");
      return;
    }

    if (isFavorite) {
      deleteFavoriteMutation.mutate();
      return;
    }

    createFavoriteMutation.mutate();
  };

  return (
    <button
      className={cn(
        variant === "icon"
          ? "grid size-8 place-items-center rounded-md border p-0"
          : "flex w-full items-center justify-center gap-2 rounded-md border py-3 text-sm font-bold",
        isFavorite
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-gray-300 bg-white text-gray-900",
        className,
      )}
      type="button"
      aria-label={
        isFavorite
          ? activeLabel
          : inactiveLabel
      }
      aria-pressed={isFavorite}
      disabled={
        isMutating ||
        (Boolean(accessToken) &&
          favoriteStatusQuery.isPending)
      }
      onClick={handleClick}
    >
      <img
        className="size-5"
        src={
          isFavorite
            ? "/icons/movie-icons/bookmark.svg"
            : "/icons/movie-icons/bookmark-outline.svg"
        }
        alt=""
        aria-hidden="true"
      />

      {variant === "text" &&
        (isMutating
          ? "처리 중"
          : isFavorite
            ? activeLabel
            : inactiveLabel)}
    </button>
  );
}