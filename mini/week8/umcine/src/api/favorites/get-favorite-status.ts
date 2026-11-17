import { authApi } from "../auth-api";
import type { FavoriteApiResponse, FavoriteStatus } from "./models";

// GET /favorites/{movieId}: 즐겨찾기하지 않은 영화도 200과 isFavorite: false로 응답해요.
export async function getFavoriteStatus(movieId: number): Promise<FavoriteStatus> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<FavoriteApiResponse<FavoriteStatus>>();

  return response.result;
}
