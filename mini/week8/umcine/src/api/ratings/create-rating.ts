import { authApi } from "../auth-api";
import type { Rating, RatingApiResponse } from "./models";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string | null;
}

// POST /ratings: 작성자는 토큰으로 식별하므로 memberId를 보내지 않아요.
export async function createRating(body: CreateRatingRequest): Promise<Rating> {
  const response = await authApi
    .post("ratings", { json: body })
    .json<RatingApiResponse<Rating>>();

  return response.result;
}
