export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <a className="header__logo" href="/">
            <span className="header__logo-icon">
                <img
                src="/icons/movie-icons/movie.svg"
                alt=""
                aria-hidden="true"
                />
            </span>

            <span>UMCine</span>
            </a>

        <nav className="header__nav" aria-label="주요 메뉴">
          <a className="header__nav-link header__nav-link--active" href="/">
            영화
          </a>

          <a className="header__nav-link" href="/search">
            검색
          </a>

          <a className="header__nav-link" href="/mypage">
            내 정보
          </a>
        </nav>

        <div className="header__actions">
          <button
            className="header__search-button"
            type="button"
            aria-label="영화 검색"
          >
            <img
              src="/icons/movie-icons/search.svg"
              alt=""
              aria-hidden="true"
            />
          </button>

          <button className="header__login-button" type="button">
            로그인
          </button>
        </div>
      </div>
    </header>
  )
}