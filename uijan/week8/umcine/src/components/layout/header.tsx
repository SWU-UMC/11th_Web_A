import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

function Header() {

  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
        <img
            src="/movie-icons/movie.svg"
            alt="UMCine"
            className="logo-icon rounded border-2"
        />
        <span>UMCine</span>
        </div>

        <nav className="nav">
          <Link to="/">
            영화
          </Link>
          <Link to="/search">
            검색
          </Link>
          <a>내 정보</a>
        </nav>
      </div>

      <div className="header-right">
        <button className="search-button">
          <img src="/movie-icons/search.svg" alt="검색" />
        </button>

        {!accessToken ? (
          <Link to="/login">로그인</Link>
        ) : meQuery.isLoading ? (
          <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <Link to="/mypage">마이페이지</Link>
        )}
      </div>
    </header>
  );
}

export default Header;