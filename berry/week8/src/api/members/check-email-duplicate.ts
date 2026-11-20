import { apiClient } from "../api-client";

export interface CheckEmailDuplicateResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    available: boolean;
  };
}

export function checkEmailDuplicate(email: string) {
  return apiClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckEmailDuplicateResponse>();
}
