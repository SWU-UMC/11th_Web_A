import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState, type SubmitEvent } from 'react'
import { searchMovies } from '../../api/movies/search-movies'
import { toMovie } from '../../utils/movies/to-movie'
import './search-page.css'

function SearchForm({ query, hasQuery }: { query: string; hasQuery: boolean }) {
  const [searchText, setSearchText] = useState(query)
  const navigate = useNavigate({ from: '/search' })

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextQuery = searchText.trim()
    void navigate({ search: nextQuery ? { query: nextQuery } : {} })
  }

  return (
    <form className="movie-search-form" role="search" onSubmit={handleSubmit}>
      <img className="movie-search-form__icon" src="/icons/movie-icons/movie-icons/search.svg" alt="" />
      <input type="text" aria-label="영화 검색어" placeholder="예: 스파이더맨" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
      {searchText && <button className="movie-search-form__clear" type="button" aria-label="검색어 지우기" onClick={() => setSearchText('')}><img src="/icons/movie-icons/movie-icons/close.svg" alt="" /></button>}
      <button className="movie-search-form__submit" type="submit">{hasQuery ? '다시 검색' : '검색'}</button>
    </form>
  )
}

export function SearchPage() {
  const { query = '' } = useSearch({ from: '/search' })
  const trimmedQuery = query.trim()
  const hasQuery = Boolean(trimmedQuery)

  // TanStack Query로 영화 검색 (검색어가 있을 때만 요청)
  const searchQuery = useQuery({
    queryKey: ['movies', 'search', { query: trimmedQuery }],
    queryFn: () => searchMovies({ query: trimmedQuery }),
    enabled: hasQuery,
  })

  const isLoading = searchQuery.isLoading
  const errorMessage = searchQuery.isError ? '검색 결과를 불러오지 못했어요.' : null
  const results = (searchQuery.data?.results ?? []).map((movie) => toMovie(movie))
  return (
    <>
      <main className={`movie-search-page${hasQuery ? ' movie-search-page--results' : ''}`}>
        <div className="movie-search-page__inner">
          <h1>{hasQuery ? '영화 검색' : '어떤 영화를 찾고 있나요?'}</h1>
          <SearchForm key={query} query={query} hasQuery={hasQuery} />
          {hasQuery && <section aria-label="영화 검색 결과">
            <div className="movie-search-summary" aria-live="polite">
              <h2>‘{query.trim()}’ 검색 결과</h2>
              <span>영화 {results.length}편{results.length > 0 ? ' · 1페이지' : ''}</span>
            </div>
            {isLoading ? <div className="movie-search-empty"><p>검색 중이에요...</p></div> :
              errorMessage ? <div className="movie-search-empty"><p>{errorMessage}</p><span>잠시 후 다시 시도해 주세요.</span></div> :
              results.length === 0 ? <div className="movie-search-empty"><p>검색 결과가 없어요.</p><span>다른 제목이나 영문 제목으로 검색해 보세요.</span></div> :
              <ul className="movie-search-results">
                {results.map((movie) => <li className="movie-search-result" key={movie.id}>
                  <Link className="movie-search-result__poster" to="/movies/$movieId" params={{ movieId: String(movie.id) }}><img src={movie.posterPath} alt={`${movie.title} 포스터`} /></Link>
                  <div className="movie-search-result__body">
                    <h3>{movie.title}</h3>
                    <div className="movie-search-result__meta"><span>{movie.originalTitle}</span><time dateTime={movie.releaseDate.replaceAll('.', '-')}>{movie.releaseDate}</time></div>
                    <p>{movie.overview}</p>
                    <Link className="movie-search-result__link" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>상세 보기 <span aria-hidden="true">→</span></Link>
                  </div>
                </li>)}
              </ul>}
          </section>}
        </div>
      </main>
      {hasQuery && <footer className="movie-search-footer"><img src="/images/logos/tmdb-logo.svg" alt="TMDB" /><span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span></footer>}
    </>
  )
}
