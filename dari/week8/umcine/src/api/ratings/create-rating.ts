import { authApi } from "../auth-api";
import type {
  ApiResponse,
  Rating,
} from "./models";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

export async function createRating(
  body: CreateRatingRequest,
): Promise<Rating> {
  const response = await authApi
    .post("ratings", {
      json: body,
    })
    .json<ApiResponse<Rating>>();

  return response.result;
}