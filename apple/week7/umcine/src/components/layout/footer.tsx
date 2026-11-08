export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#eaeaea] py-5 mt-auto">
      <div className="max-w-300 mx-auto px-6 flex items-center justify-end gap-2">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB 로고" className="h-3" />
        <span className="text-xs text-[#888888]">
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#888888] underline"
          >
            TMDB
          </a>
          .
        </span>
      </div>
    </footer>
  );
}
