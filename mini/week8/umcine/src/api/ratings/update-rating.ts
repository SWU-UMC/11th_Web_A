import { authApi } from "../auth-api";
import type { Rating, RatingApiResponse } from "./models";

export interface UpdateRatingRequest {
  score: number;
  comment: string | null;
}

// PATCH /ratings/{ratingId}: 서버에서 작성자 본인인지 확인해요.
export async function updateRating(
  ratingId: number,
  body: UpdateRatingRequest,
): Promise<Rating> {
  const response = await authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<RatingApiResponse<Rating>>();

  return response.result;
}
