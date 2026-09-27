import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/layout/header";
import Footer from "../components/footer";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col font-[Pretendard,sans-serif]">
      <Header />
      <div className="flex flex-1 flex-col bg-[#f6f7f9] [&>main]:flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  ),
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});
