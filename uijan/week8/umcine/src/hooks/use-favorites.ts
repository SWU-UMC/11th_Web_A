// src/hooks/use-favorites.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFavorite,
  deleteFavorite,
  getFavoriteStatus,
  getMyFavorites,
} from "../api/members/favorites";
import { useAuthStore } from "../stores/auth-store";

// 마이페이지: bookmarkedMovieIds 대신 사용
export function useMyFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["favorites"],
    queryFn: getMyFavorites,
    enabled: Boolean(accessToken),
  });
}

// 영화 상세: isBookmarked 여부 확인용
export function useFavoriteStatusQuery(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken) && movieId > 0,
  });
}

// 영화 상세: toggleBookmark 대신 사용
export function useToggleFavoriteMutation(movieId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isCurrentlyFavorite: boolean) =>
      isCurrentlyFavorite ? deleteFavorite(movieId) : createFavorite(movieId),
    onSuccess: () => {
      // 상세 페이지 하트 상태와 마이페이지 목록 캐시를 동시에 갱신
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => {
      alert("즐겨찾기 처리에 실패했어요. 다시 시도해 주세요.");
    },
  });
}