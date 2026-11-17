import { createFileRoute, redirect } from "@tanstack/react-router";
import { ProtectedLayout } from "../../components/layout/protected-layout";
import { useAuthStore } from "../../stores/auth-store";

// (protected) 폴더는 URL에 포함되지 않는 Route Group이에요.
// 이 폴더 안의 페이지는 모두 이 Layout Route를 거쳐 렌더링돼요.
export const Route = createFileRoute("/(protected)")({
  // 페이지에 들어오기 전에 토큰이 없으면 로그인 페이지로 이동해요.
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: ProtectedLayout,
});
