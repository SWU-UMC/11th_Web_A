import apiClient from "../api-client";
import type { Rating, RatingApiResponse } from "./models";

// GET /members/{memberId}/ratings: 특정 회원의 평점 목록을 조회하는 공개 API예요.
export async function getMemberRatings(memberId: number): Promise<Rating[]> {
  const response = await apiClient
    .get(`members/${memberId}/ratings`)
    .json<Rating[] | RatingApiResponse<Rating[]>>();

  // 현재 서버는 배열을 바로 응답하고, 다른 API는 공통 응답 형식을 사용해요.
  // 두 형식 모두 처리해 서버 응답 형식이 통일되어도 그대로 동작하게 해요.
  return Array.isArray(response) ? response : response.result;
}
