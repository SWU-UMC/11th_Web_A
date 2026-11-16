import { useRef, useState } from "react";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";

const INITIAL_USER = {
  nickname: "1로할래요",
  email: "taken@naver.com",
};

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function MyPageEdit() {
  const [nickname, setNickname] = useState(INITIAL_USER.nickname);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const trimmedNickname = nickname.trim();
  const isNicknameChanged = trimmedNickname !== INITIAL_USER.nickname;
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;

  // 닉네임이 변경되지 않았거나, 변경 후 중복 확인을 통과했을 때 저장 가능
  const canSave =
    isNicknameValid && (!isNicknameChanged || isNicknameAvailable);

  const handleNicknameChange = (value: string) => {
    if (isCheckingNickname) return;
    setNickname(value);
    // 닉네임이 기존과 달라지면 중복 확인 상태 초기화
    setIsNicknameAvailable(value.trim() === INITIAL_USER.nickname);
  };

  const handleCheckDuplicate = async () => {
    if (!isNicknameValid || !isNicknameChanged || isCheckingNickname) return;

    setIsCheckingNickname(true);
    try {
      const response = await checkNicknameDuplicate(trimmedNickname);
      setIsNicknameAvailable(response.available);
      alert(
        response.available
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      setIsNicknameAvailable(false);
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsCheckingNickname(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      alert("프로필 이미지는 최대 5MB까지 업로드할 수 있어요.");
      e.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSave) return;

    console.log("변경사항 저장:", {
      nickname: trimmedNickname,
      hasNewImage: Boolean(previewUrl),
    });
    alert("변경사항이 저장되었어요.");
  };

  const handleWithdraw = () => {
    const confirmed = window.confirm(
      "정말 탈퇴하시겠어요? 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.",
    );
    if (confirmed) {
      console.log("회원 탈퇴 요청");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col justify-between bg-[#f8f9fa] px-6 py-10">
      <form
        onSubmit={handleSave}
        noValidate
        className="mx-auto w-full max-w-[1080px]"
      >
        {/* 상단 타이틀 및 변경사항 저장 버튼 */}
        <div className="flex items-start justify-between pb-8">
          <div>
            <h1 className="text-[26px] font-bold tracking-tight text-gray-900">
              내 정보 수정
            </h1>
            <p className="mt-1.5 text-xs text-gray-400">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>

          <button
            type="submit"
            disabled={!canSave}
            className="rounded-lg bg-[#4b6bfb] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#3b5bdb] disabled:cursor-not-allowed disabled:bg-[#4b6bfb]/40"
          >
            변경사항 저장
          </button>
        </div>

        {/* 본문: 좌측 프로필 이미지 & 우측 폼 */}
        <div className="mt-4 grid grid-cols-1 gap-10 md:grid-cols-[240px_1fr] md:items-start">
          {/* 좌측 프로필 이미지 업로더 */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-800 focus:outline-none"
                aria-label="프로필 이미지 변경"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="프로필 미리보기"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg
                    className="h-12 w-12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
                  </svg>
                )}
              </button>

              {/* 우측 하단 연필 아이콘 배지 */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
                aria-label="프로필 이미지 선택"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <p className="mt-3 text-xs font-bold text-gray-800">
              프로필 이미지
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400">
              선택 사항 · 최대 5MB
            </p>
          </div>

          {/* 우측 닉네임 & 이메일 입력 영역 */}
          <div className="w-full max-w-[560px] space-y-5">
            {/* 닉네임 */}
            <div>
              <label
                htmlFor="nickname"
                className="mb-1.5 block text-xs font-semibold text-gray-800"
              >
                닉네임
              </label>
              <div className="relative flex items-center">
                <input
                  id="nickname"
                  type="text"
                  placeholder="2–12자"
                  value={nickname}
                  onChange={(e) => handleNicknameChange(e.target.value)}
                  disabled={isCheckingNickname}
                  className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-3.5 pr-20 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#4b6bfb] focus:outline-none disabled:bg-gray-50"
                />
                <button
                  type="button"
                  disabled={
                    !isNicknameValid ||
                    !isNicknameChanged ||
                    isCheckingNickname
                  }
                  onClick={handleCheckDuplicate}
                  className="absolute right-3.5 text-xs font-semibold text-[#4b6bfb] hover:text-[#3b5bdb] disabled:cursor-not-allowed disabled:text-gray-300"
                >
                  {isCheckingNickname ? "확인 중" : "중복 확인"}
                </button>
              </div>
              {nickname.length > 0 && !isNicknameValid && (
                <p className="mt-1.5 text-[11px] text-red-500">
                  닉네임은 2~12자 이내로 입력해 주세요.
                </p>
              )}
            </div>

            {/* 이메일 (읽기 전용) */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold text-gray-800"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={INITIAL_USER.email}
                readOnly
                className="h-12 w-full cursor-default rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-800 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </form>

      {/* 하단 회원 탈퇴 영역 */}
      <div className="mx-auto mt-20 w-full max-w-[1080px]">
        <div className="flex flex-col justify-between gap-4 rounded-xl border border-red-200 bg-red-50/40 px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold text-red-600">회원 탈퇴</p>
            <p className="mt-1 text-[11px] text-red-400">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={handleWithdraw}
            className="shrink-0 self-start rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 sm:self-auto"
          >
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}