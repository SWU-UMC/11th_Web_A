import { isHTTPError } from "ky";

export function getMovieDetailErrorMessage(error: unknown) {
  // HTTP 404 오류는 존재하지 않는 영화로 구분
  if (isHTTPError(error) && error.response.status === 404) {
    return "영화를 찾을 수 없어요.";
  }

  // 그 외의 API 오류
  return "영화 정보를 불러오지 못했어요.";
}