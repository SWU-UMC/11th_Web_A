import { authApi } from "../auth-api";
import type { ApiResponse } from "./models";

export async function deleteRating(
  ratingId: number,
): Promise<void> {
  await authApi
    .delete(`ratings/${ratingId}`)
    .json<ApiResponse<null>>();
}