// [1] 필요한 훅(React 기본 훅, TanStack Query)과 API 함수, 전역 스토어 불러오기
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";

// 업로드 가능한 프로필 이미지 최대 용량 제한 (5MB)
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export function MyPageEdit() {
  // [2] Zustand 스토어에서 현재 로그인 토큰 가져오기
  const accessToken = useAuthStore((state) => state.accessToken);

  // [3] 헤더와 동일한 ["members", "me"] 키로 내 정보 조회 (이미 캐시에 있다면 네트워크 요청 없이 즉시 꺼내 옴)
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken), // 토큰이 있을 때만 조회 실행
    staleTime: 5 * 60 * 1000,     // 5분간 데이터를 최신 상태로 유지
    retry: false,                 // 실패 시 불필요한 재시도 방지
  });

  // [4] 내 정보 수정 API(PATCH)를 호출하고, 성공 시 ["members", "me"] 캐시를 즉시 교체하는 Mutation 훅
  const updateMeMutation = useUpdateMeMutation();

  // 서버에서 받아온 원본 닉네임과 이메일 (로딩 전에는 빈 문자열로 안전하게 처리)
  const currentNickname = meQuery.data?.nickname ?? "";
  const currentEmail = meQuery.data?.email ?? "";

  // [5] 사용자 입력 및 UI 상태 관리
  const [nickname, setNickname] = useState(currentNickname); // 입력창에 타이핑 중인 닉네임
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 선택한 이미지 미리보기 URL
  const [isCheckingNickname, setIsCheckingNickname] = useState(false); // 닉네임 중복 확인 API 통신 중 여부
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(true); // 닉네임 사용 가능 여부

  // 숨겨진 <input type="file"> 요소에 직접 접근하기 위한 Ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // [6] 비동기로 내 정보(meQuery.data)가 도착하거나 수정된 직후, 입력창의 닉네임을 최신 서버 값으로 동기화
  useEffect(() => {
    if (meQuery.data?.nickname) {
      setNickname(meQuery.data.nickname);
      setIsNicknameAvailable(true); // 서버에 저장된 내 현재 닉네임이므로 중복 확인 통과 상태로 간주
    }
  }, [meQuery.data?.nickname]);

  // [7] 폼 유효성 및 제출 가능 여부 계산 (파생 상태)
  const trimmedNickname = nickname.trim();
  const isNicknameChanged = trimmedNickname !== currentNickname; // 기존 닉네임과 달라졌는지 확인
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12; // 2~12자 길이 조건 검사

  // 길이 조건을 만족하면서, (닉네임을 안 바꿨거나 OR 바꾼 뒤 중복 확인을 통과했을 때) 저장 버튼 활성화
  const canSubmit =
    isNicknameValid && (!isNicknameChanged || isNicknameAvailable);

  // [8] 닉네임 입력창 타이핑 핸들러
  const handleNicknameChange = (value: string) => {
    if (isCheckingNickname) return;
    setNickname(value);
    // 입력한 값이 원래 내 닉네임과 같으면 통과(true), 다르면 다시 중복 확인을 받도록 초기화(false)
    setIsNicknameAvailable(value.trim() === currentNickname);
  };

  // [9] '중복 확인' 버튼 클릭 핸들러
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

  // [10] 프로필 이미지 파일 선택 및 용량 검증 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      alert("프로필 이미지는 최대 5MB까지 업로드할 수 있어요.");
      e.target.value = "";
      return;
    }

    // 브라우저 메모리에 임시 미리보기 URL 생성
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // [11] 폼 제출('저장' 버튼 클릭) 핸들러: 서버에 닉네임 수정 요청 전송
  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate({ nickname: trimmedNickname });
  };

  // [12] 회원 탈퇴 확인 창 핸들러
  const handleWithdraw = () => {
    const confirmed = window.confirm(
      "정말 탈퇴하시겠어요? 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.",
    );
    if (confirmed) {
      console.log("회원 탈퇴 요청");
    }
  };

  // [13] 화면 렌더링 (상단 헤더 + 좌측 프로필 이미지 업로더 + 우측 입력 폼 + 하단 회원 탈퇴 영역)
  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col justify-between bg-[#f8f9fa] px-6 py-10">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto w-full max-w-[1080px]"
      >
        {/* 상단 타이틀 및 저장 버튼 (요청 중에는 isPending으로 버튼 비활성화 및 문구 변경) */}
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
            disabled={!canSubmit || updateMeMutation.isPending}
            className="rounded-lg bg-[#4b6bfb] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#3b5bdb] disabled:cursor-not-allowed disabled:bg-[#4b6bfb]/40"
          >
            {updateMeMutation.isPending ? "저장 중" : "저장"}
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

            {/* 이메일 (읽기 전용 - 로그인한 계정의 실제 이메일 표시) */}
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
                value={currentEmail}
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