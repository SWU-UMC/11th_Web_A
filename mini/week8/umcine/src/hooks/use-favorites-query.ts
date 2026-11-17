import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../api/favorites/get-favorites";
import { useAuthStore } from "../stores/auth-store";

export const favoritesQueryKey = ["favorites", "list"] as const;

// 마이페이지 목록과 영화 카드의 즐겨찾기 표시에 함께 사용해요.
export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: favoritesQueryKey,
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
  });
}
