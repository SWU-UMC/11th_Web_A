import { Link, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState, type SubmitEvent } from 'react'
import { getMovieDetail } from '../../api/movies/get-movie-detail'
import { useBookmarkStore } from '../../stores/bookmark-store'
import type { Movie } from '../../types/movie'
import { toMovie } from '../../utils/movies/to-movie'
import './movie-detail-page.css'

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  if (!isValidMovieId) return <main className="movie-detail"><p>잘못된 영화 ID예요.</p></main>
  if (movieDetailQuery.isPending) return <main className="movie-detail"><p>영화 정보를 불러오는 중이에요.</p></main>
  if (movieDetailQuery.isError) return <main className="movie-detail"><p>오류가 발생했어요: {movieDetailQuery.error.message}</p></main>

  return <MovieDetail key={movieId} movie={toMovie(movieDetailQuery.data)} />
}

function MovieDetail({ movie }: { movie: Movie }) {
  // 북마크 상태는 목록 페이지와 같은 Zustand 스토어를 사용
  const bookmarked = useBookmarkStore((state) => state.bookmarkedMovieIds.includes(movie.id))
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark)
  const [savedReview] = useState(() => {
    try {
      const value = JSON.parse(localStorage.getItem(`umcine-review-${movie.id}`) ?? 'null')
      return { rating: Number.isInteger(value?.rating) && value.rating >= 1 && value.rating <= 5 ? value.rating as number : 0, review: typeof value?.review === 'string' ? value.review as string : '' }
    } catch { return { rating: 0, review: '' } }
  })
  const [rating, setRating] = useState(savedReview.rating)
  const [review, setReview] = useState(savedReview.review)
  const [message, setMessage] = useState('')

  function saveReview(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!rating) { setMessage('별점을 먼저 선택해 주세요.'); return }
    try {
      localStorage.setItem(`umcine-review-${movie.id}`, JSON.stringify({ rating, review: review.trim() }))
      setMessage('이 브라우저에 평점을 저장했어요.')
    } catch { setMessage('저장하지 못했어요. 브라우저 저장 공간 설정을 확인해 주세요.') }
  }

  return <>
    <main className="movie-detail">
      <section className="movie-detail-hero" aria-labelledby="movie-detail-title">
        <img className="movie-detail-hero__image" src={movie.backdropPath} alt="" />
        <div className="movie-detail-hero__inner">
          <Link className="movie-detail-back" to="/"><span aria-hidden="true">‹</span> 영화 목록</Link>
          <div className="movie-detail-hero__text">
            <h1 id="movie-detail-title">{movie.title}</h1>
            <p>{movie.originalTitle}</p>
            <p className="movie-detail-hero__meta">{movie.releaseDate} <span>·</span> {movie.genres.join(' · ')} <span>·</span> {movie.runtime}</p>
          </div>
        </div>
      </section>
      <div className="movie-detail-content">
        <img className="movie-detail-poster" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <section className="movie-detail-story" aria-label="영화 소개">
          <h2>{movie.tagline}</h2>
          <p>{movie.overview}</p>
          <button type="button" className="movie-detail-bookmark" aria-pressed={bookmarked} onClick={() => toggleBookmark(movie.id)}>
            <img src={`/icons/movie-icons/movie-icons/${bookmarked ? 'bookmark' : 'bookmark-outline'}.svg`} alt="" />{bookmarked ? '즐겨찾기 해제' : '즐겨찾기'}
          </button>
        </section>
        <form className="movie-detail-review" onSubmit={saveReview}>
          <h2>내 평점</h2>
          <p className="movie-detail-review__hint">별점을 남긴 후, 후기는 선택이에요.</p>
          <div className="movie-detail-stars" role="group" aria-label="별점 선택">
            {[1, 2, 3, 4, 5].map((star) => <button type="button" key={star} aria-label={`${star}점`} aria-pressed={rating === star} className={star <= rating ? 'is-selected' : ''} onClick={() => { setRating(star); setMessage('') }}><span aria-hidden="true">★</span></button>)}
          </div>
          <textarea aria-label="영화 감상" placeholder="영화를 보고 느낀 점을 남겨보세요." value={review} onChange={(event) => { setReview(event.target.value); setMessage('') }} maxLength={2000} />
          <button className="movie-detail-save" type="submit">평점 저장</button>
          <p className="movie-detail-review__message" role="status">{message}</p>
        </form>
      </div>
    </main>
    <footer className="movie-detail-footer"><img src="/images/logos/tmdb-logo.svg" alt="TMDB" /><span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span></footer>
  </>
}
