import { backendClient } from "../backend-client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    nickname: string;
    accessToken: string;
  };
}

export function login(body: LoginRequest) {
  return backendClient
    .post("auth/login", {
      json: body,
    })
    .json<LoginResponse>();
}