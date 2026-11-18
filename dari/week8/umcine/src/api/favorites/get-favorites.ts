import { authApi } from "../auth-api";
import type {
  ApiResponse,
  Favorite,
} from "./models";

export async function getFavorites(): Promise<
  Favorite[]
> {
  const response = await authApi
    .get("favorites")
    .json<ApiResponse<Favorite[]>>();

  return response.result;
}