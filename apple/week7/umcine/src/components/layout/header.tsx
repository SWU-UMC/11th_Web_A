import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store.js";

// 현재 페이지 메뉴는 TanStack Router가 붙여주는 data-status="active"로 밑줄 처리
const navLinkClass =
  "text-[15px] font-medium text-[#555555] transition-colors duration-200 hover:text-[#111111] no-underline data-[status=active]:text-[#111111] data-[status=active]:underline data-[status=active]:underline-offset-4";

const loginButtonClass =
  "bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 hover:bg-blue-700 no-underline";

// 상단 Header 컴포넌트
export function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <header className="w-full bg-white border-b border-[#eaeaea] sticky top-0 z-100">
      <div className="max-w-300 mx-auto h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="flex items-center justify-center p-0.5 border-2 border-black rounded-lg bg-white">
              <img src="/icons/movie.svg" alt="로고 이미지" className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#111111]">UMCine</h3>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" activeOptions={{ exact: true }} className={navLinkClass}>영화</Link>
            <Link to="/search" className={navLinkClass}>검색</Link>
            <Link to="/my_page" className={navLinkClass}>내 정보</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/search"
            className="flex items-center justify-center p-2 border border-gray-200 rounded-lg bg-white"
            aria-label="검색"
          >
            <img src="/icons/search.svg" alt="검색 아이콘" className="w-5 h-5" />
          </Link>
          {user ? (
            <button type="button" onClick={handleLogout} className={loginButtonClass}>
              로그아웃
            </button>
          ) : (
            <Link to="/login" className={loginButtonClass}>로그인</Link>
          )}
        </div>
      </div>
    </header>
  );
}
