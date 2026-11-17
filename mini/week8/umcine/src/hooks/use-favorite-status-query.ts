import { useQuery } from "@tanstack/react-query";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import { useAuthStore } from "../stores/auth-store";

export function favoriteStatusQueryKey(movieId: number) {
  return ["favorites", "status", movieId] as const;
}

// 영화 상세에서 즐겨찾기 버튼을 채운 상태로 보여 줄지 결정해요.
export function useFavoriteStatusQuery(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: favoriteStatusQueryKey(movieId),
    queryFn: () => getFavoriteStatus(movieId),
    // 즐겨찾기는 로그인한 회원의 데이터이므로 토큰이 있을 때만 조회해요.
    enabled: Boolean(accessToken),
  });
}
