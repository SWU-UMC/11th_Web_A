import { authApi } from "../auth-api";
import type { RatingApiResponse } from "./models";

// DELETE /ratings/{ratingId}: 성공하면 result는 null이에요.
export async function deleteRating(ratingId: number): Promise<void> {
  await authApi.delete(`ratings/${ratingId}`).json<RatingApiResponse<null>>();
}
