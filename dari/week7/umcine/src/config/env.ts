const tmdbApiBaseUrl = import.meta.env.VITE_TMDB_API_BASE_URL;
const tmdbAccessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const backendApiBaseUrl = import.meta.env.VITE_BACKEND_API_BASE_URL;

if (!tmdbApiBaseUrl || !tmdbAccessToken || !backendApiBaseUrl) {
  throw new Error("필수 환경 변수가 필요해요.");
}

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  backendApiBaseUrl,
};