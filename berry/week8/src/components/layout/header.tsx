import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="border-b border-[#E5E7EB] bg-white flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-10">
        <Link to="/">
          <div className="flex items-center gap-2.5">
            <img
              src="../../../public/icons/movie.svg"
              className="rounded-sm border-2 border-black object-cover p-0.5"
            />
            <h2 className="font-bold text-lg">UMCine</h2>
          </div>
        </Link>
        <nav className={cn("flex items-center gap-6")}>
          <Link
            to="/"
            className="relative py-2 text-sm font-medium text-gray-400 hover:text-black transition-colors"
            activeProps={{
              className:
                "!text-black !font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black",
            }}
          >
            영화
          </Link>
          <Link
            to="/search"
            className="relative py-2 text-sm font-medium text-gray-400 hover:text-black transition-colors"
            activeProps={{
              className:
                "!text-black !font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black",
            }}
          >
            검색
          </Link>
          <Link
            to="/mypage"
            className="relative py-2 text-sm font-medium text-gray-400 hover:text-black transition-colors"
            activeProps={{
              className:
                "!text-black !font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black",
            }}
          >
            내 정보
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2.5">
        <Link
          to="/search"
          className="relative rounded-sm border border-black overflow-hidden p-1 opacity-40"
        >
          <img src="../../../public/icons/search.svg" />
        </Link>
        <button className="py-2.5 px-4 border-0 rounded-[10px] bg-blue-600 text-white hover:bg-blue-700">
          {!accessToken ? (
            <Link to="/login">로그인</Link>
          ) : meQuery.isLoading ? (
            <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <Link to="/mypage">마이페이지</Link>
          )}
        </button>
      </div>
    </header>
  );
}
