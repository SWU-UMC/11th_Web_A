import { backendClient } from "../backend-client";

export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

export interface SignupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    memberId: number;
    email: string;
    nickname: string;
  };
}

export function signup(body: SignupRequest) {
  return backendClient
    .post("members", {
      json: body,
    })
    .json<SignupResponse>();
}