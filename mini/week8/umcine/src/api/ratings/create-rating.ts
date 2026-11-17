import ky from "ky";

interface CreateRatingRequest {
  score: number;
  comment: string | null;
}

const apiClient = ky.create({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}/`,
});

function createRating(movieId: number, request: CreateRatingRequest) {
  return apiClient.post(`movies/${movieId}/ratings`, { json: request }).json();
}

export { createRating };