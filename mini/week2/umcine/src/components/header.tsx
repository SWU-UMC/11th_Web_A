import "./header.css";

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
          <a className="active" href="#">
            영화
          </a>
          <a href="#">검색</a>
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