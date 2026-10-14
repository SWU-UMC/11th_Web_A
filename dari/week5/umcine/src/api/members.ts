import { backendClient } from "./backend-client";

interface CheckResponse {
  available: boolean;
}

interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

function checkNickname(nickname: string) {
  return backendClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckResponse>();
}

function checkEmail(email: string) {
  return backendClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckResponse>();
}

function getMemberRatings(memberId: number) {
  return backendClient
    .get(`members/${memberId}/ratings`)
    .json<RatingResponse[]>();
}

export {
  checkEmail,
  checkNickname,
  getMemberRatings,
  type CheckResponse,
  type RatingResponse,
};