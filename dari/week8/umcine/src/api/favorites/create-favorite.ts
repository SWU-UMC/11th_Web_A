import { authApi } from "../auth-api";
import type {
  ApiResponse,
  Favorite,
} from "./models";

export interface CreateFavoriteRequest {
  movieId: number;
}

export async function createFavorite(
  body: CreateFavoriteRequest,
): Promise<Favorite> {
  const response = await authApi
    .post("favorites", {
      json: body,
    })
    .json<ApiResponse<Favorite>>();

  return response.result;
}