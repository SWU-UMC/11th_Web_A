export default function Footer() {
  return (
    <footer className="flex min-h-[57px] shrink-0 items-center justify-end border-t border-[#e3e6eb] bg-white px-4 py-4 md:px-10 xl:px-20">
      <div className="flex items-center gap-2">
        <img
          className="block size-6 shrink-0"
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
        />

        <p className="m-0 text-[12px] font-normal leading-[14px] text-[#606774]">
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            className="text-inherit"
            href="https://www.themoviedb.org/?language=ko"
            target="_blank"
            rel="noreferrer"
          >
            TMDB.
          </a>
        </p>
      </div>
    </footer>
  );
}
