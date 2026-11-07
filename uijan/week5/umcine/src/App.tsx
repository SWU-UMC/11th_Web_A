import { useState } from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import { movies } from "./data/movies";

function App() {
  const [movieList, setMovieList] = useState(movies);

  const handleBookmarkToggle = (id: number) => {
    setMovieList((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie
      )
    );
  };

  return (
    <>
      <Header />

      <main>
        <section className="movie-section">
          <h2>영화 목록</h2>

          <MovieGrid
            movies={movieList}
            onBookmarkToggle={handleBookmarkToggle}
          />

          <Pagination />
        </section>
      </main>
    </>
  );
}

export default App;