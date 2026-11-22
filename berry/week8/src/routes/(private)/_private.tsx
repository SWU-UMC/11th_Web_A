import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";
import { PrivateLayout } from "../../components/layout/private-layout";

export const Route = createFileRoute("/(private)/_private")({
  beforeLoad: () => {
    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: PrivateLayout,
});
