import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    // 토큰이 없으면 로그인 페이지로 강제 이동
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  // 로그인된 상태라면 하위 페이지(mypage, mypage_edit)를 렌더링
  return <Outlet />;
}