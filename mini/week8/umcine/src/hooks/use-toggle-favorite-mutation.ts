import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isHTTPError } from "ky";
import { createFavorite } from "../api/favorites/create-favorite";
import { deleteFavorite } from "../api/favorites/delete-favorite";
import type { Favorite, FavoriteStatus } from "../api/favorites/models";
import { favoritesQueryKey } from "./use-favorites-query";
import { favoriteStatusQueryKey } from "./use-favorite-status-query";

// 현재 즐겨찾기 여부에 따라 등록(POST) 또는 해제(DELETE)를 요청해요.
export function useToggleFavoriteMutation(movieId: number) {
  const queryClient = useQueryClient();

  const setIsFavorite = (isFavorite: boolean) => {
    queryClient.setQueryData<FavoriteStatus>(favoriteStatusQueryKey(movieId), {
      isFavorite,
    });
  };

  return useMutation({
    mutationFn: async (isFavorite: boolean): Promise<Favorite | null> => {
      if (isFavorite) {
        await deleteFavorite(movieId);
        return null;
      }

      return createFavorite(movieId);
    },
    onSuccess: (createdFavorite) => {
      // 요청 결과로 다음 상태를 이미 알고 있으므로 캐시를 바로 바꿔요.
      setIsFavorite(createdFavorite !== null);

      queryClient.setQueryData<Favorite[]>(favoritesQueryKey, (favorites) => {
        if (!favorites) return favorites;

        return createdFavorite
          ? [createdFavorite, ...favorites]
          : favorites.filter((favorite) => favorite.movieId !== movieId);
      });
    },
    onError: (error) => {
      // 다른 탭이나 기기에서 상태가 먼저 바뀐 경우 서버 상태에 맞춰요.
      if (isHTTPError(error) && error.response.status === 409) {
        setIsFavorite(true);
        return;
      }

      if (isHTTPError(error) && error.response.status === 404) {
        setIsFavorite(false);
        return;
      }

      alert("즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요.");
    },
    onSettled: () => {
      // 서버의 최신 목록과 맞추기 위해 목록 query를 다시 조회하도록 표시해요.
      queryClient.invalidateQueries({ queryKey: favoritesQueryKey });
    },
  });
}
