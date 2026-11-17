import { authApi } from "../auth-api";
import type { Favorite, FavoriteApiResponse } from "./models";

// GET /favorites: 로그인한 회원의 즐겨찾기 목록을 최신순으로 조회해요.
export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi
    .get("favorites")
    .json<FavoriteApiResponse<Favorite[]>>();

  return response.result;
}
