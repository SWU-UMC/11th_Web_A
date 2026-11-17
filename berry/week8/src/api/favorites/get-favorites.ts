import { authApi } from "../auth-api";

export interface FavoriteInfo {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

interface FavoritesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteInfo[];
}

export async function getFavorites() {
  return authApi.get("favorites").json<FavoritesResponse>();
}
