import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

const navLinkClass =
  "text-[15px] text-gray-600 [&.active]:font-bold [&.active]:text-gray-900 [&.active]:underline [&.active]:underline-offset-4";

export function Header() {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="h-16 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-full w-[min(1160px,calc(100%-48px))] items-center">
        <Link
          className="flex items-center gap-2.5 text-xl font-extrabold"
          to="/"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-[10px] border-[3px] border-gray-900">
            <img
              className="size-5"
              src="/icons/movie-icons/movie.svg"
              alt=""
              aria-hidden="true"
            />
          </span>

          <span>UMCine</span>
        </Link>

        <nav
          className="ml-10 flex items-center gap-7"
          aria-label="주요 메뉴"
        >
          <Link className={navLinkClass} to="/">
            영화
          </Link>

          <Link className={navLinkClass} to="/search">
            검색
          </Link>

          <Link className={navLinkClass} to="/my">
            내 정보
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            className="grid size-[42px] place-items-center rounded-lg border border-gray-300"
            to="/search"
            aria-label="영화 검색"
          >
            <img
              className="size-5"
              src="/icons/movie-icons/search.svg"
              alt=""
              aria-hidden="true"
            />
          </Link>

          {!accessToken ? (
            <Link
              className="flex h-9 items-center rounded-md bg-blue-600 px-4 text-sm font-bold text-white"
              to="/login"
            >
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span
              className="h-9 w-24 animate-pulse rounded-md bg-gray-200"
              aria-label="회원 정보 불러오는 중"
            />
          ) : (
            <Link
              className="flex h-9 items-center rounded-md bg-blue-600 px-4 text-sm font-bold text-white"
              to="/my"
            >
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}