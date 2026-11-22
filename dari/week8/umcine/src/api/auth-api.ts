import { useAuthStore } from "../stores/auth-store";
import { backendClient } from "./backend-client";

export const authApi = backendClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const accessToken =
          useAuthStore.getState().accessToken;

        if (accessToken) {
          request.headers.set(
            "Authorization",
            `Bearer ${accessToken}`,
          );
        }
      },
    ],

    afterResponse: [
      ({ response }) => {
        if (response.status === 401) {
          useAuthStore
            .getState()
            .setAccessToken(null);
        }
      },
    ],
  },
});