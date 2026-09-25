import { Link } from '@tanstack/react-router';

// 상단 Header 컴포넌트
export function Header() {
  return (
    <header className="w-full bg-white border-b border-[#eaeaea] sticky top-0 z-100">
      <div className="max-w-300 mx-auto h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" type="button" className="flex items-center gap-2 no-underline">
            <div className="flex items-center justify-center p-0.5 border-2 border-black rounded-lg bg-white">
              <img src="/icons/movie.svg" alt="로고 이미지" className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#111111]">UMCine</h3>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-[15px] font-medium text-[#555555] transition-colors duration-200 hover:text-[#111111] no-underline">영화</Link>
            <Link to="/search" className="text-[15px] font-medium text-[#555555] transition-colors duration-200 hover:text-[#111111] no-underline">검색</Link>
            <Link to="/my_page" className="text-[15px] font-medium text-[#555555] transition-colors duration-200 hover:text-[#111111] no-underline">내 정보</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/search" className="flex items-center justify-center p-2 border border-gray-200 rounded-lg bg-white" aria-label="검색">
            <img src="/icons/search.svg" alt="검색 아이콘" class="w-5 h-5" />
          </Link>
          <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold transition-colors duration-200 hover:bg-blue-700">로그인</button>
        </div>
      </div>
    </header>
  );
}
