import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export function Header() {
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
        <Link to="/login">
          <button className="py-2.5 px-4 border-0 rounded-[10px] bg-blue-600 text-white hover:bg-blue-700">
            로그인
          </button>
        </Link>
      </div>
    </header>
  );
}
