//(5).env.local의 환경변수 읽어와 누락여부 검증, 객체(env)로 내보냄 - 여러파일서 import.meta.env 쓰다 오타/값 빌때 앱 시작 시 즉시 에러잡아내기 위함.
//연결 : .env.local -> 1. tmdb-client.ts   2. get-movies-with-fetch.ts
const tmdbApiBaseUrl = import.meta.env.VITE_TMDB_API_BASE_URL;
const tmdbAccessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수가 필요해요.");
}

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  tmdbApiBaseUrl,
  tmdbAccessToken,
};