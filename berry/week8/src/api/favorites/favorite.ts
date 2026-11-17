import { authApi } from "../auth-api";

interface FavoriteInfo {
  isFavorite: boolean;
}

interface FavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteInfo;
}

export async function getFavorite(movieId: number): Promise<FavoriteInfo> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<FavoriteResponse>();
  return response.result;
}
