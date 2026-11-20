import { authApi } from "../auth-api";

export interface RatingInfo {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface RatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RatingInfo;
}

export async function getRating(memberId: number): Promise<RatingInfo> {
  const response = await authApi
    .get(`/members/${memberId}/ratings`)
    .json<RatingResponse>();
  return response.result;
}
