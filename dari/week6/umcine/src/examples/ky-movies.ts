import { getMovieDetail } from "../api/movies/get-movie-detail";
import { getMovies } from "../api/movies/get-movies";
import { searchMovies } from "../api/movies/search-movies";

async function testMovieApis() {
  try {
    const popularResponse = await getMovies({ page: 1 });
    console.log("인기 영화:", popularResponse.results);

    const searchResponse = await searchMovies({
      query: "인셉션",
      page: 1,
    });
    console.log("검색 결과:", searchResponse.results);

    const detailResponse = await getMovieDetail(27205);
    console.log("영화 상세:", detailResponse);
  } catch (error) {
    console.error("TMDB 요청 실패:", error);
  }
}

void testMovieApis();