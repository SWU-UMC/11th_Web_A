type ProfileAvatarProps = { src?: string; size?: number };

// 프로필 이미지가 없으면 회색 원 안에 사람 아이콘을 보여줌
export function ProfileAvatar({ src, size = 56 }: ProfileAvatarProps) {
  return (
    <span className="profile-avatar" style={{ width: size, height: size }}>
      {src
        ? <img className="profile-avatar__image" src={src} alt="프로필 이미지" />
        : <img className="profile-avatar__icon" src="/icons/movie-icons/movie-icons/person.svg" alt="" />}
    </span>
  );
}
