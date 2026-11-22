import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router";
import Header from "../components/layout/header";
import Footer from "../components/footer";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});

function RootLayout() {
  const isProfileEdit = useRouterState({ select: (state) => state.location.pathname === "/profile/edit" });
  return (
    <div className="flex min-h-screen flex-col font-[Pretendard,sans-serif]">
      <Header />
      <div className="flex flex-1 flex-col bg-[#f6f7f9] [&>main]:flex-1">
        <Outlet />
      </div>
      {!isProfileEdit && <Footer />}
    </div>
  );
}
