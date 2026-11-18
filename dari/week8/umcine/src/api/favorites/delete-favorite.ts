import { authApi } from "../auth-api";
import type { ApiResponse } from "./models";

export async function deleteFavorite(
  movieId: number,
): Promise<void> {
  await authApi
    .delete(`favorites/${movieId}`)
    .json<ApiResponse<null>>();
}