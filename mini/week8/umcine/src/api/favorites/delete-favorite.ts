import { authApi } from "../auth-api";
import type { FavoriteApiResponse } from "./models";

// DELETE /favorites/{movieId}: 성공하면 result는 null이에요.
export async function deleteFavorite(movieId: number): Promise<void> {
  await authApi.delete(`favorites/${movieId}`).json<FavoriteApiResponse<null>>();
}
