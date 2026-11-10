import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../stores/auth-store";

// /mypage, /mypage/edit 공통 부모 라우트
export const Route = createFileRoute("/mypage")({
  // 로그인하지 않았으면 로그인 페이지로 이동
  beforeLoad: () => {
    if (!useAuthStore.getState().user) throw redirect({ to: "/login" });
  },
  component: Outlet,
});
