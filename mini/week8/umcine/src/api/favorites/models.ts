// 서버는 TMDB 영화 ID와 회원의 관계만 저장해요.
export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export interface FavoriteStatus {
  isFavorite: boolean;
}

export interface FavoriteApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
