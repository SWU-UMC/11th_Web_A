import { useState } from 'react'
import Header from './components/header'
import MovieGrid from './components/movie-grid'
import Pagination from './components/pagination'
import { movies as initialMovies } from './data/movies'

export default function App() {
  const [movies, setMovies] = useState(initialMovies)
  const [currentPage, setCurrentPage] = useState(1)

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? {
              ...movie,
              isBookmarked: !movie.isBookmarked,
            }
          : movie,
      ),
    )
  }

  return (
    <div className="app">
      <Header />

      <main>
        <h1>영화 목록</h1>

        <MovieGrid
          movies={movies}
          onToggleBookmark={handleToggleBookmark}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
        />
      </main>

      <footer className="footer">
        <span className="footer__tmdb">TMDB</span>
        <span>
          This product uses the TMDB API but is not endorsed or certified
          by TMDB.
        </span>
      </footer>
    </div>
  )
}