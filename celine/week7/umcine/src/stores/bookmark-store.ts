import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
    // persist를 사용해 Zustand 상태를 localStorage에 저장
  persist(
    (set) => ({
      // 처음에는 북마크한 영화가 없으므로 빈 배열
      bookmarkedMovieIds: [],

      // 북마크 버튼을 눌렀을 때 실행되는 함수
      toggleBookmark: (movieId) =>
        set((state) => ({
          // 현재 영화가 이미 북마크되어 있는지 확인
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            // 이미 있으면 해당 영화 ID를 제거 → 북마크 해제
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
            // 없으면 기존 배열에 영화 ID 추가 → 북마크 추가
            : [...state.bookmarkedMovieIds, movieId],
        })),
    }),

    {
      // localStorage에 저장될 key 이름
      name: "umcine-bookmark-store",
    },
  ),
);