import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { searchMovies } from "../../api/movies/search-movies.ts";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid.tsx";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const normalizedQuery = query?.trim() ?? "";
  const [searchText, setSearchText] = useState(query ?? "");

  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: () => searchMovies({ query: normalizedQuery }),
    enabled: normalizedQuery.length > 0,
  });

  const searchResults = searchQuery.data?.results ?? [];

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-6 pb-12 pt-16 text-center">
        <h1 className="mb-8 text-3xl font-extrabold">
          어떤 영화를 찾고 있나요?
        </h1>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            const nextQuery = searchText.trim();
            navigate({
              search: nextQuery ? { query: nextQuery } : {},
            });
          }}
          className="flex w-full max-w-2xl items-center overflow-hidden rounded-2xl border-2 border-black bg-white px-4 py-2 shadow-sm"
        >
          <img src="/icons/search.svg" alt="" className="mr-3 text-gray-400" />
          <input
            aria-label="검색어"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="예: 스파이더맨"
            className="w-full bg-transparent py-2 text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="ml-2 flex-shrink-0 rounded-xl bg-black px-6 py-2.5 font-medium text-white transition-colors hover:bg-gray-800"
          >
            검색
          </button>
        </form>
      </div>

      {!normalizedQuery ? (
        <div className="py-20 text-center text-sm text-gray-400">
          검색어를 입력해 주세요.
        </div>
      ) : searchQuery.isLoading ? (
        <div className="py-20 text-center text-sm text-gray-500">
          영화를 검색하고 있어요.
        </div>
      ) : searchQuery.isError ? (
        <div className="py-20 text-center text-sm text-red-600">
          검색 결과를 불러오지 못했어요.
        </div>
      ) : searchQuery.isSuccess && searchResults.length === 0 ? (
        <div className="py-20 text-center text-sm text-gray-500">
          검색 결과가 없어요.
        </div>
      ) : searchQuery.isSuccess ? (
        <MovieGrid movies={searchResults} />
      ) : null}
    </main>
  );
}
