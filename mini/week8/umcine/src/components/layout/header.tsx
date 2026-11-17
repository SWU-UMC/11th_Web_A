import { useQuery } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

export default function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isMoviePage = pathname === "/" || pathname.startsWith("/movies/");
  const isSearchPage = pathname === "/search";
  const isProfilePage = pathname === "/profile" || pathname === "/profile/edit";
  const navClassName = "text-center text-[14px] font-bold leading-none text-[#606774] no-underline";
  const activeClassName = "text-[#17191e] underline underline-offset-2";
  const authButtonClassName = "flex h-[42px] min-w-[71px] items-center justify-center rounded-lg border border-white bg-[#2563eb] px-4 text-[14px] font-extrabold leading-none text-white no-underline";

  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="flex min-h-[91px] shrink-0 flex-wrap items-center justify-between gap-4 border-b border-[#e3e6eb] bg-white px-4 py-6 md:px-10 xl:px-20">
      <div className="flex flex-wrap items-center gap-6 sm:gap-[42px]">
        <div className="flex items-center gap-[10px]">
          <div className="flex size-8 items-center justify-center rounded-lg border-2 border-[#17191e]">
            <img className="size-6" src="/icons/movie.svg" alt="" />
          </div>
          <span className="text-[20px] font-black leading-none tracking-[-0.7px] text-[#17191e]">UMCine</span>
        </div>
        <nav className="flex items-center gap-[30px]" aria-label="주 메뉴">
          <Link to="/" className={cn(navClassName, isMoviePage && activeClassName)}>영화</Link>
          <Link to="/search" className={cn(navClassName, isSearchPage && activeClassName)}>검색</Link>
          <Link to="/profile" className={cn(navClassName, isProfilePage && activeClassName)}>내 정보</Link>
        </nav>
      </div>
      <div className="flex items-center gap-[10px]">
        <Link className="flex size-[42px] items-center justify-center rounded-lg border border-[#e3e6eb] bg-white" to="/search" aria-label="검색">
          <img className="size-6" src="/icons/search.svg" alt="" />
        </Link>
        {!accessToken ? (
          <Link className={authButtonClassName} to="/login">로그인</Link>
        ) : meQuery.isLoading ? (
          <span className="h-[42px] w-24 animate-pulse rounded-lg bg-gray-200" aria-label="내 정보를 불러오는 중" />
        ) : (
          <Link className={authButtonClassName} to="/profile">마이페이지</Link>
        )}
      </div>
    </header>
  );
}
