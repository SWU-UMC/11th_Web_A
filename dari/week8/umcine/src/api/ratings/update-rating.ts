import { authApi } from "../auth-api";
import type { ApiResponse } from "./models";

export interface UpdateRatingRequest {
  score: number;
  comment?: string;
}

interface UpdateRatingVariables {
  ratingId: number;
  body: UpdateRatingRequest;
}

export async function updateRating({
  ratingId,
  body,
}: UpdateRatingVariables): Promise<void> {
  await authApi
    .patch(`ratings/${ratingId}`, {
      json: body,
    })
    .json<ApiResponse<null>>();
}