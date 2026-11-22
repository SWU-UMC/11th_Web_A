//(5) TMDB API가 응답하는 JSON 데이터 구조의 TypeScript 인터페이스 정의 - 서버에서 어떤 필드가 어떤 타입으로 오는지 규정해 자동완성&타입 안정성 확보
// 연결 : get-movies.ts    search-movies.ts     get-movie-detail.ts    각 페이지 컴포넌트
// 백엔드 API 명세에 맞게 응답 필드 타입 수정 또는 새 도메인(리뷰, 유저 등) 모델 파일 생성
interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

interface TmdbMovieListItem extends TmdbMovie {
  genre_ids: number[];
}

interface TmdbMovieListResponse {
  page: number;
  results: TmdbMovieListItem[];
  total_pages: number;
  total_results: number;
}

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbMovieDetail extends TmdbMovie {
  genres: TmdbGenre[];
  runtime: number | null;
  tagline: string;
}

export type {
  TmdbGenre,
  TmdbMovie,
  TmdbMovieDetail,
  TmdbMovieListItem,
  TmdbMovieListResponse,
};