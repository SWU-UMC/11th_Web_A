import { Link } from "@tanstack/react-router";
import "../header.css";

export default function Header() {
  return (

    <header className="header">

      <div className="header-left">
        
        <div className="header-logo">
          <div className="logo-icon">
            <img src="/icons/movie.svg" alt="" />
          </div>
          <span>UMCine</span>
        </div>

        <nav className="header-nav">
          <Link to="/">영화</Link>
          <Link to="/search">검색</Link>
          <a href="#">내 정보</a>
        </nav>

      </div>

      <div className="header-actions">
        <button className="search-button" type="button" aria-label="검색">
          <img src="/icons/search.svg" alt="" />
        </button>

        <button className="login-button" type="button">로그인</button>
      </div>

    </header>
  );
}