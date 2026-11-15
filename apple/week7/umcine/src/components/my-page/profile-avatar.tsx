import type { ReactNode } from "react";

interface ProfileAvatarProps {
  src: string | null;
  children?: ReactNode; // 수정 화면의 연필 배지 같은 오버레이
}

export function ProfileAvatar({ src, children }: ProfileAvatarProps) {
  return (
    <div className="relative size-18 shrink-0">
      <div className="flex size-full items-center justify-center overflow-hidden rounded-full bg-gray-200">
        {src ? (
          <img src={src} alt="프로필 이미지" className="size-full object-cover" />
        ) : (
          <img src="/icons/person.svg" alt="기본 프로필" className="size-9" />
        )}
      </div>
      {children}
    </div>
  );
}
