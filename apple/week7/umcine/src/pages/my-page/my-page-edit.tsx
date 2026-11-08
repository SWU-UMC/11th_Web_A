import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";
import { ProfileAvatar } from "@/components/my-page/profile-avatar";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const labelClass = "mb-2 block text-sm font-bold text-gray-900";
const inputClass =
  "h-11 w-full rounded-lg border bg-white px-4 text-[15px] text-gray-900 outline-none transition-colors focus:border-blue-600";

export function MyPageEdit() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profileImage ?? null,
  );
  const [checkedNickname, setCheckedNickname] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  if (!user) return null; // 라우트 가드(requireAuth)가 먼저 처리

  const trimmedNickname = nickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const isNicknameChanged = trimmedNickname !== user.nickname;
  const isImageChanged = profileImage !== user.profileImage;
  const isNicknameVerified = checkedNickname === trimmedNickname;

  // 닉네임을 바꿨다면 중복 확인까지 통과해야 저장 가능
  const canSave =
    isNicknameValid &&
    (isNicknameChanged || isImageChanged) &&
    (!isNicknameChanged || isNicknameVerified);

  const showNicknameError = nickname.length > 0 && !isNicknameValid;

  const handleChangeNickname = (value: string) => {
    if (isChecking) return;
    setNickname(value);
    setCheckedNickname(null); // 값이 바뀌면 다시 중복 확인
  };

  const handleCheckDuplicate = async () => {
    if (!isNicknameValid || isChecking) return;
    if (!isNicknameChanged) {
      alert("현재 사용 중인 닉네임이에요.");
      return;
    }

    setIsChecking(true);
    try {
      const { available } = await checkNicknameDuplicate(trimmedNickname);
      setCheckedNickname(available ? trimmedNickname : null);
      alert(
        available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      setCheckedNickname(null);
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // 같은 파일을 다시 선택해도 change 이벤트가 발생하도록 초기화
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있어요.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      alert("프로필 이미지는 최대 5MB까지 업로드할 수 있어요.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSave) return;

    // TODO: 수정 API 연결 시 이 부분을 API 호출로 교체
    updateProfile({ nickname: trimmedNickname, profileImage });
    navigate({ to: "/my_page" });
  };

  const handleWithdraw = () => {
    if (!window.confirm("정말 탈퇴하시겠어요? 이 작업은 되돌릴 수 없어요.")) return;

    // TODO: 회원 탈퇴 API 연결
    useBookmarkStore.setState({ bookmarkedMovieIds: [] });
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col bg-gray-50">
      <main className="mx-auto flex w-full max-w-300 flex-1 flex-col px-6 pt-8 pb-8">
        <form
          id="profile-form"
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col"
        >
          {/* 제목 + 저장 버튼 */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                내 정보 수정
              </h1>
              <p className="mt-3 text-sm text-gray-500">
                닉네임과 프로필 이미지만 변경할 수 있어요.
              </p>
            </div>
            <button
              type="submit"
              disabled={!canSave}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              변경사항 저장
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2">
            {/* 왼쪽: 프로필 이미지 */}
            <div className="flex flex-col items-center pt-4">
              <ProfileAvatar src={profileImage}>
                <button
                  type="button"
                  aria-label="프로필 이미지 변경"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute right-0 bottom-0 flex size-6 translate-x-1 translate-y-1 items-center justify-center rounded-full bg-white"
                >
                  <img src="/icons/edit.svg" alt="" className="size-6" />
                </button>
              </ProfileAvatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSelectImage}
              />
              <p className="mt-2 text-base font-bold text-gray-900">프로필 이미지</p>
              <p className="mt-1 text-xs text-gray-400">선택 사항 · 최대 5MB</p>
            </div>

            {/* 오른쪽: 닉네임 / 이메일 */}
            <div className="flex flex-col gap-5">
              <div>
                <label htmlFor="nickname" className={labelClass}>닉네임</label>
                <div className="relative">
                  <input
                    id="nickname"
                    type="text"
                    placeholder="2–12자"
                    value={nickname}
                    disabled={isChecking}
                    onChange={(e) => handleChangeNickname(e.target.value)}
                    className={`${inputClass} pr-24 ${
                      showNicknameError ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    disabled={!isNicknameValid || isChecking}
                    onClick={handleCheckDuplicate}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-sm font-bold text-blue-600 hover:text-blue-700 disabled:opacity-50"
                  >
                    {isChecking ? "확인 중" : "중복 확인"}
                  </button>
                </div>
                {showNicknameError && (
                  <p className="mt-1.5 text-xs text-red-500">
                    닉네임은 2~12자로 입력해 주세요
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>이메일</label>
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  readOnly
                  className={`${inputClass} border-gray-200`}
                />
              </div>
            </div>
          </div>
        </form>

        {/* 회원 탈퇴 영역 (하단 고정) */}
        <section className="mt-auto flex items-center justify-between rounded-xl border border-red-500 bg-red-50 px-6 py-5">
          <div>
            <h2 className="text-base font-bold text-red-600">회원 탈퇴</h2>
            <p className="mt-1 text-xs text-red-600">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={handleWithdraw}
            className="rounded-lg border border-red-500 bg-white px-5 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
          >
            회원 탈퇴
          </button>
        </section>
      </main>
    </div>
  );
}
