import { authApi } from "../auth-api";

export interface FavoriteItem {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export async function getMyFavorites(): Promise<FavoriteItem[]> {
  const res = await authApi.get("favorites").json<{ result: FavoriteItem[] }>();
  return res.result;
}

export async function getFavoriteStatus(movieId: number): Promise<boolean> {
  const res = await authApi
    .get(`favorites/${movieId}`)
    .json<{ result: { isFavorite: boolean } }>();
  return res.result.isFavorite;
}

export function createFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json();
}

export function deleteFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json();
}