import { authApi } from "../auth-api";

interface DeleteFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: null;
}

export function deleteFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<DeleteFavoriteResponse>();
}
