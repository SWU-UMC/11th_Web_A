import { authApi } from "../auth-api";
import type { Favorite, FavoriteApiResponse } from "./models";

// POST /favorites: 회원은 토큰으로 식별하므로 영화 ID만 보내요.
export async function createFavorite(movieId: number): Promise<Favorite> {
  const response = await authApi
    .post("favorites", { json: { movieId } })
    .json<FavoriteApiResponse<Favorite>>();

  return response.result;
}
