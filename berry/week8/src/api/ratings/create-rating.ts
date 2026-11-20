import { authApi } from "../auth-api";
import type { RatingInfo } from "./rating";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string;
}

interface CreateRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RatingInfo;
}

export function createRating(body: CreateRatingRequest) {
  return authApi.post("ratings", { json: body }).json<CreateRatingResponse>();
}
