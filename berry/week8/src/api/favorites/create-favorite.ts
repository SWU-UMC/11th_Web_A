import { authApi } from "../auth-api";
import type { FavoriteInfo } from "./get-favorites";

export interface CreateFavoriteRequest {
  movieId: number;
}

interface CreateFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteInfo;
}

export function createFavorite(body: CreateFavoriteRequest) {
  return authApi
    .post("favorites", { json: body })
    .json<CreateFavoriteResponse>();
}
