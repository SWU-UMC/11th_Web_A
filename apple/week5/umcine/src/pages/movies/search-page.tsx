import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
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
    <main className="max-w-270 mx-auto py-10 px-5 text-[#111] font-sans">
      <h1 className="text-2xl font-bold mb-6">영화 검색</h1>
      <form className="flex gap-3 mb-8" onSubmit={handleSubmit}>
        <div className="relative flex-1 flex items-center">
          <img src="/icons/search.svg" className="absolute left-4 text-[#888] text-sm" />
          <input
            className="w-full h-12 pl-11 pr-10 border border-[#e5e5e5] rounded-lg text-[15px] outline-none bg-[#f9f9f9] focus:bg-white focus:border-[#333]"
            aria-label="검색어"
            placeholder="검색어를 입력하세요"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          {searchText && (
            <button
              type="button"
              className="absolute right-3 border-none bg-transparent text-[#888] cursor-pointer text-sm p-1"
              onClick={() => setSearchText("")}
            >
              ✕
            </button>
          )}
        </div>
        <button type="submit" className="h-12 px-6 bg-[#1a1a1b] text-white border-none rounded-lg font-semibold cursor-pointer whitespace-nowrap">
          다시 검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="py-15 text-center text-[#888]">검색어를 입력해 주세요.</p>
      ) : (
        <div>
          <div className="flex justify-between items-baseline mb-6">
            <h2 className="text-lg font-bold">‘{query}’ 검색 결과</h2>
            <p className="text-[13px] text-[#888]">영화 {searchResults.length}편</p>
          </div>
          {searchResults.length === 0 ? (
            <p className="py-15 text-center text-[#888]">검색 결과가 없어요.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-x-8 gap-y-6 list-none p-0 m-0">
              {searchResults.map((movie) => (
                <li key={movie.id} className="flex gap-4">
                  <img
                    className="w-30 h-42.5 object-cover rounded-lg shrink-0"
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                  />
                  <div className="flex flex-col">
                    <h3 className="text-base font-bold mb-1.5 m-0">{movie.title}</h3>
                    <p className="text-[13px] text-[#888] mb-2.5 m-0">
                      {movie.originalTitle} · {movie.releaseDate}
                    </p>
                    <p className="text-[13px] text-[#666] leading-normal mb-3 line-clamp-2">{movie.overview}</p>
                    <Link
                      className="text-[13px] font-semibold text-blue-600 no-underline mt-auto"
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      상세 보기 →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}
