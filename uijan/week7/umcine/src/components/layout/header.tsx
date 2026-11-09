import { Link } from "@tanstack/react-router";
function Header() {
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

        <button className="login-button">
          로그인
        </button>
      </div>
    </header>
  );
}

export default Header;