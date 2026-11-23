import { Link } from '@tanstack/react-router'
import { useAuthStore } from '../../stores/auth-store'
import './header.css'

export function Header() {
  const isLoggedIn = useAuthStore((state) => state.user !== null)

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" to="/" aria-label="UMCine 홈">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6" />
            <rect x="5.5" y="7" width="13" height="11" rx="1.5" fill="currentColor" />
            <path d="m7 7 2 3m2-3 2 3m2-3 2 3" stroke="white" strokeWidth="1.3" />
          </svg>
          <span>UMCine</span>
        </Link>

        <nav className="site-header__nav" aria-label="주 메뉴">
          <Link className="site-header__nav-link" to="/" activeOptions={{ exact: true }} activeProps={{ className: 'site-header__nav-link--active' }}>영화</Link>
          <Link className="site-header__nav-link" to="/search" activeProps={{ className: 'site-header__nav-link--active' }}>검색</Link>
          <Link className="site-header__nav-link" to="/mypage" activeProps={{ className: 'site-header__nav-link--active' }}>내 정보</Link>
        </nav>

        <div className="site-header__actions">
          <Link className="site-header__search" to="/search" aria-label="영화 검색">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="1.7" />
              <path d="m15 15 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </Link>
          {isLoggedIn
            ? <Link className="site-header__mypage" to="/mypage">마이페이지</Link>
            : <Link className="site-header__mypage" to="/login">로그인</Link>}
        </div>
      </div>
    </header>
  )
}

