import { authApi } from "../auth-api";
import type {
  ApiResponse,
  FavoriteStatus,
} from "./models";

export async function getFavoriteStatus(
  movieId: number,
): Promise<FavoriteStatus> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<FavoriteStatus>>();

  return response.result;
}