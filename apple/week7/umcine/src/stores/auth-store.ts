import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthUser {
  email: string;
  nickname: string;
  profileImage: string | null; // data URL
}

interface AuthStore {
  user: AuthUser | null;
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (
    patch: Partial<Pick<AuthUser, "nickname" | "profileImage">>,
  ) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      // TODO: 로그인 API가 생기면 응답값(이메일, 닉네임, 프로필 이미지)으로 교체
      login: (email) =>
        set((state) => ({
          user:
            // 같은 이메일로 다시 로그인하면 수정해 둔 닉네임/이미지를 유지
            state.user?.email === email
              ? state.user
              : { email, nickname: email.split("@")[0], profileImage: null },
        })),
      logout: () => set({ user: null }),
      updateProfile: (patch) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...patch } } : state,
        ),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
