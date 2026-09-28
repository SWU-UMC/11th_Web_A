import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const hasQuery = normalizedQuery.length > 0;

  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main
      className={cn(
        "bg-[#f6f7f9] px-4 py-6 text-[#17191e] md:px-10 xl:px-20",
        !hasQuery && "py-0",
      )}
    >
      <section className={cn(!hasQuery && "mx-auto max-w-[790px] pb-24 pt-24 md:pb-[210px] md:pt-[209px]")}>
      <h1
        className={cn(
          "mb-5 text-[38px] font-bold leading-[44px] tracking-[-1.71px]",
          !hasQuery && "mb-9 text-center text-[28px] leading-9 md:min-h-[53px] md:text-[46px] md:leading-[52.44px] md:tracking-[-2.3px]",
        )}
      >
        {hasQuery ? "영화 검색" : "어떤 영화를 찾고 있나요?"}
      </h1>

      <form
        role="search"
        onSubmit={handleSubmit}
        className={cn(
          "flex h-[54px] items-center gap-[18px] rounded-[9px] border border-[#e3e6eb] bg-white py-0 pl-[15px] pr-[10px] focus-within:border-[#17191e] focus-within:ring-1 focus-within:ring-[#17191e]",
          !hasQuery && "h-[74px] gap-[14px] rounded-xl border-2 border-[#17191e] py-0 pl-[21px] pr-[17px] shadow-[0_12px_34px_0_rgb(17_19_24/0.08)] focus-within:ring-0",
        )}
      >
        <img className="size-6 shrink-0" src="/icons/search.svg" alt="" />
        <input
          ref={inputRef}
          className={cn(
            "min-w-0 flex-1 bg-transparent py-2 text-[14px] font-bold leading-none text-[#17191e] outline-none placeholder:font-normal placeholder:text-[#969da8] [&::-webkit-search-cancel-button]:appearance-none",
            !hasQuery && "py-0 text-[17px] font-normal tracking-normal",
          )}
          type="search"
          name="query"
          autoComplete="off"
          aria-label="검색어"
          placeholder="예: 스파이더맨"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        {searchText && (
          <button
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded hover:bg-[#f6f7f9]"
            type="button"
            aria-label="검색어 지우기"
            onClick={() => {
              setSearchText("");
              inputRef.current?.focus();
            }}
          >
            <img className="size-5" src="/icons/close.svg" alt="" />
          </button>
        )}
        <button
          className={cn(
            "shrink-0 cursor-pointer rounded-md bg-[#17191e] px-4 py-[10px] text-[14px] font-bold leading-5 text-white hover:bg-[#30343d]",
            !hasQuery && "h-[42px] min-w-[59px] rounded-lg border border-[#17191e] py-0 font-extrabold leading-none",
          )}
          type="submit"
        >
          {hasQuery ? "다시 검색" : "검색"}
        </button>
      </form>
      </section>

      {hasQuery && (
        <>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-b border-[#e3e6eb] pb-4" aria-live="polite">
            <h2 className="min-w-0 break-words text-[16px] font-bold leading-6">
              ‘{query?.trim()}’ 검색 결과
            </h2>
            <p className="text-[12px] leading-5 text-[#606774]">영화 {searchResults.length}편</p>
          </div>

          {searchResults.length === 0 ? (
            <p className="py-20 text-center text-[16px] leading-6 text-[#606774]">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
              {searchResults.map((movie) => (
                <li className="flex min-w-0 items-start gap-4 border-b border-[#e3e6eb] py-6" key={movie.id}>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="block w-24 shrink-0 overflow-hidden rounded-lg sm:w-32"
                  >
                    <img
                      className="aspect-[2/3] w-full object-cover"
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-[18px] font-bold leading-6">{movie.title}</h3>
                    <div className="mt-1 flex flex-wrap gap-x-2 text-[12px] leading-5 text-[#969da8]">
                      <p>{movie.originalTitle}</p>
                      <p>{movie.releaseDate}</p>
                    </div>
                    <p className="mt-3 break-words text-[14px] leading-6 text-[#606774]">{movie.overview}</p>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-4 inline-flex items-center gap-1 text-[12px] font-bold leading-5 text-[#2563eb] hover:underline"
                    >
                      상세 보기 <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
