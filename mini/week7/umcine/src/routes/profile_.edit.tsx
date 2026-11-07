import { createFileRoute, redirect } from "@tanstack/react-router";
import { ProfileEditPage } from "../pages/profile/profile-edit-page";

export const Route = createFileRoute("/profile_/edit")({
  beforeLoad: () => {
    // TODO: 로그인 API 연결 후 실제 로그인 상태를 확인해요.
    if (!import.meta.env.DEV) throw redirect({ to: "/login" });
  },
  component: ProfileEditPage,
});
