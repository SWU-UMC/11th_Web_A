import { Navigate, Outlet } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

// 로그인 전용 페이지들의 공통 레이아웃이에요.
export function ProtectedLayout() {
  // 페이지를 보는 중에 토큰이 사라지면(401 응답 등) 로그인 페이지로 이동해요.
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  // (protected) 폴더 안의 하위 페이지를 렌더링해요.
  return <Outlet />;
}
