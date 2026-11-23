import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  email: string;
  nickname: string;
  // 프로필 이미지 (data URL). 없으면 기본 아이콘을 보여줌
  profileImage?: string;
}

interface AuthStore {
  // 로그인하지 않은 상태면 null
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (changes: Partial<Omit<AuthUser, "email">>) => void;
}

export const useAuthStore = create<AuthStore>()(
  // 새로고침해도 로그인 상태가 유지되도록 localStorage에 저장
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      // 이메일은 바꿀 수 없으므로 닉네임과 프로필 이미지만 수정
      updateUser: (changes) =>
        set((state) => (state.user ? { user: { ...state.user, ...changes } } : state)),
    }),
    { name: "umcine-auth-store" },
  ),
);
