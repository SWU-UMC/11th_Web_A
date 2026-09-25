import type { Movie } from "../types/movie";

// MovieCard 컴포넌트 규칙
interface MovieCardProps {
  movie: Movie; // 영화 객체
  onToggleBookmark: (id: number) => void; // 북마크 버튼 클릭 시 호출되는 함수
}

// MovieCard 컴포넌트
export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="poster-img"
        />

        {/* 북마크 버튼: 북마크 상태(isBookmarked)가 true이면 active 클래스 추가 (파란색 버튼) */}
        <button
          type="button"
          className={`bookmark-btn ${movie.isBookmarked ? "active" : ""}`}
          onClick={() => onToggleBookmark(movie.id)}
        >

          {/* 북마크 상태면 채워진 아이콘, 아니면 테두리 아이콘 표시 */}
          {movie.isBookmarked ? (
            <img
              src="/icons/bookmark.svg"
              alt="북마크된 영화"
              className="bookmark-icon"
            />
          ) : (
            <img
              src="/icons/bookmark-outline.svg"
              alt="북마크 안 된 영화"
              className="bookmark-icon"
            />
          )}
        </button>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-release-date">{movie.releaseDate}</p>
      </div>
    </article>
  );
}
