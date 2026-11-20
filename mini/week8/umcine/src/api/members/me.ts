import { authApi } from "../auth-api";

export interface MemberInfo {
  // 평점 목록 조회(GET /members/{memberId}/ratings)에 사용해요.
  memberId: number;
  email: string;
  nickname: string;
  createdAt: string;
}

interface MeResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberInfo;
}

export async function getMe(): Promise<MemberInfo> {
  const response = await authApi.get("members/me").json<MeResponse>();
  return response.result;
}
