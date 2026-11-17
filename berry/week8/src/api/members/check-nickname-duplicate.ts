import { apiClient } from "../api-client";

export interface CheckNicknameDuplicateResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    available: boolean;
  };
}

export function checkNicknameDuplicate(nickname: string) {
  return apiClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckNicknameDuplicateResponse>();
}
