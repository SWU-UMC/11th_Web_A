import type { TmdbMovie, TmdbMovieDetail } from "../../api/movies/models";
import type { Movie } from "../../types/movie";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "./tmdb-image";

// TMDB API 응답(snake_case)을 화면에서 쓰는 Movie 타입(camelCase)으로 변환
export function toMovie(
  movie: TmdbMovie | TmdbMovieDetail,
  isBookmarked = false,
): Movie {
  const detail = "genres" in movie ? movie : null;

  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,
    posterPath: getTmdbPosterUrl(movie.poster_path) ?? "",
    backdropPath: getTmdbBackdropUrl(movie.backdrop_path) ?? "",
    genres: detail?.genres.map((genre) => genre.name) ?? [],
    runtime: detail?.runtime ? `${detail.runtime}분` : "",
    tagline: detail?.tagline ?? "",
    overview: movie.overview,
    isBookmarked,
  };
}
