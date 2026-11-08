import { create, type StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

type PersistedBookmarkStore = Pick<BookmarkStore, "bookmarkedMovieIds">;

const bookmarkStoreCreator = persist<
  BookmarkStore,
  [],
  [],
  PersistedBookmarkStore
>(
    (set) => ({
      bookmarkedMovieIds: [],
      toggleBookmark: (movieId) =>
        set((state) => ({
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
            : [...state.bookmarkedMovieIds, movieId],
        })),
    }),
    {
      name: "umcine-bookmark-store",
      storage: createJSONStorage<PersistedBookmarkStore>(() => localStorage),
      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
    },
) as unknown as StateCreator<BookmarkStore>;

export const useBookmarkStore = create<BookmarkStore>()(bookmarkStoreCreator);
