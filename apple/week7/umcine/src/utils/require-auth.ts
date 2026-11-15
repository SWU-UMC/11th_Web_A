import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store.js";

export function requireAuth() {
  if (!useAuthStore.getState().user) {
    throw redirect({ to: "/login" });
  }
}
