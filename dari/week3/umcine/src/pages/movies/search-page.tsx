import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  // URL의 뒤로/앞으로 가기에도 입력값을 동기화해야 하므로 예제 흐름을 유지해요.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setSearchText(query ?? ""), [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter((movie) =>
        movie.title.toLowerCase().includes(normalizedQuery) ||
        movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  if (!normalizedQuery) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-64px)] w-[min(1160px,calc(100%-48px))] flex-col items-center justify-center pb-24">
        <h1 className="mb-6 text-2xl font-bold">어떤 영화를 찾고 있나요?</h1>
        <form className="flex w-full max-w-[620px] overflow-hidden rounded-md border border-gray-400 bg-white shadow-sm focus-within:border-blue-600" onSubmit={handleSubmit}>
          <img className="ml-4 size-5 self-center opacity-60" src="/icons/movie-icons/search.svg" alt="" aria-hidden="true" />
          <input className="min-w-0 flex-1 px-3 py-3 outline-none" aria-label="검색어" placeholder="영화 제목을 입력해 주세요" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
          <button className="m-1 rounded bg-gray-900 px-5 text-sm font-bold text-white" type="submit">검색</button>
        </form>
        <p className="mt-4 text-sm text-gray-500">검색어를 입력해 주세요.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-[min(1160px,calc(100%-48px))] py-10 pb-20">
      <h1 className="mb-6 text-[28px] font-bold">영화 검색</h1>
      <form className="mb-8 flex w-full overflow-hidden rounded-md border border-gray-300 bg-white focus-within:border-blue-600" onSubmit={handleSubmit}>
        <img className="ml-4 size-5 self-center opacity-60" src="/icons/movie-icons/search.svg" alt="" aria-hidden="true" />
        <input className="min-w-0 flex-1 px-3 py-3 outline-none" aria-label="검색어" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
        <button className="m-1 rounded bg-gray-900 px-5 text-sm font-bold text-white" type="submit">검색</button>
      </form>
      {(
        <>
          <h2 className="text-xl font-bold">‘{query}’ 검색 결과</h2>
          <p className="mt-1 mb-6 text-sm text-gray-500">영화 {searchResults.length}편</p>
          {searchResults.length === 0 ? <p>검색 결과가 없어요.</p> : (
            <ul className="grid list-none grid-cols-1 gap-x-10 gap-y-6 p-0 lg:grid-cols-2">
              {searchResults.map((movie) => (
                <li className="grid grid-cols-[110px_1fr] gap-4 border-b border-gray-200 pb-6" key={movie.id}>
                  <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                    <img className="aspect-[2/3] w-full rounded-md object-cover" src={movie.posterPath} alt={`${movie.title} 포스터`} />
                  </Link>
                  <div className="min-w-0 py-1">
                    <h3 className="text-base font-bold">{movie.title}</h3>
                    <p className="mt-1 text-xs text-gray-500">{movie.originalTitle}</p>
                    <p className="mt-2 text-xs text-gray-500">{movie.releaseDate}</p>
                    <p className="my-3 line-clamp-3 text-sm leading-6 text-gray-700">{movie.overview}</p>
                    <Link className="text-sm font-bold text-blue-600" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>상세 보기 →</Link>
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
