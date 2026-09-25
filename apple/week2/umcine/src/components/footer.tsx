// 하단 Footer 컴포넌트
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB 로고" className="tmdb-logo" />
        <span className="footer-text">
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            className="footer-link"
          >
            TMDB
          </a>
          .
        </span>
      </div>
    </footer>
  );
}
