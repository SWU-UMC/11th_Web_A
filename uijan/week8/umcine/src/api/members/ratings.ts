import { authApi } from "../auth-api";

export interface RatingItem {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt?: string;
}

export async function getMemberRatings(memberId: number): Promise<RatingItem[]> {
  const res = await authApi
    .get(`members/${memberId}/ratings`)
    .json<{ result: RatingItem[] }>();
  return res.result;
}

export function createRating(body: {
  movieId: number;
  score: number;
  comment?: string;
}) {
  return authApi.post("ratings", { json: body }).json();
}

export function updateRating(
  ratingId: number,
  body: { score: number; comment?: string },
) {
  return authApi.patch(`ratings/${ratingId}`, { json: body }).json();
}

export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json();
}