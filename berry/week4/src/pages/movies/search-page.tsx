import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies.ts";
import MovieGrid from "../../components/movies/movie-grid.tsx";

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
    <main className="min-h-screen bg-white pb-20">
      {/* 상단 검색 헤더 */}
      <div className="max-w-[1440px] mx-auto px-6 pt-16 pb-12 flex flex-col items-center text-center">
        <h1 className="text-3xl font-extrabold mb-8">
          어떤 영화를 찾고 있나요?
        </h1>

        {/* 영화 검색 입력폼 */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl flex items-center bg-white border-2 border-black rounded-2xl overflow-hidden shadow-sm px-4 py-2"
        >
          <img
            src="../../../public/icons/search.svg"
            className="text-gray-400 mr-3"
          />
          <input
            aria-label="검색어"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="예: 스파이더맨"
            className="w-full py-2 text-sm focus:outline-none bg-transparent"
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors flex-shrink-0 ml-2"
          >
            검색
          </button>
        </form>

        <div className="max-w-[1440px] mx-auto px-6">
          {!normalizedQuery ? (
            <div className="text-center py-20 text-gray-400 text-sm">
              검색어를 입력해 주세요.
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-sm">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="mt-8 pb-20">
              <MovieGrid movies={searchResults} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
