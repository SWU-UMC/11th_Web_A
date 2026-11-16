import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";

export function MyPageEdit() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const updateMeMutation = useUpdateMeMutation();
  // 사용자가 수정 전에는 API에서 받은 닉네임을 보여주고, 입력하면 수정값을 사용해요.
  const [editedNickname, setEditedNickname] = useState<string | null>(null);
  const [checkedNickname, setCheckedNickname] = useState<string | null>(null);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const nickname = editedNickname ?? meQuery.data?.nickname ?? "";

  const trimmedNickname = nickname.trim();
  const canSubmit = trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const nicknameUnchanged = trimmedNickname === meQuery.data?.nickname;
  const nicknameVerified =
    nicknameUnchanged || checkedNickname === trimmedNickname;

  const handleCheckNickname = async () => {
    if (!canSubmit || isCheckingNickname) return;
    setIsCheckingNickname(true);
    setCheckedNickname(null);
    try {
      const { available } = await checkNicknameDuplicate(trimmedNickname);
      if (available) {
        setCheckedNickname(trimmedNickname);
        alert("사용할 수 있는 닉네임이에요.");
      } else {
        alert("이미 사용 중인 닉네임이에요.");
      }
    } catch {
      alert("닉네임 중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsCheckingNickname(false);
    }
  };

  const handleSave = () => {
    if (!canSubmit || !nicknameVerified || updateMeMutation.isPending) {
      if (canSubmit && !nicknameVerified) {
        alert("먼저 닉네임 중복 확인을 해 주세요.");
      }
      return;
    }
    updateMeMutation.mutate({ nickname: trimmedNickname });
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "정말 탈퇴하시겠습니까? 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.",
      )
    ) {
      alert("회원 탈퇴가 완료되었습니다.");
    }
  };

  if (!accessToken) {
    return <p className="mx-auto max-w-5xl px-6 py-10">로그인이 필요해요.</p>;
  }

  if (meQuery.isLoading) {
    return (
      <p className="mx-auto max-w-5xl px-6 py-10">
        내 정보를 불러오는 중이에요.
      </p>
    );
  }

  if (meQuery.isError || !meQuery.data) {
    return (
      <p className="mx-auto max-w-5xl px-6 py-10">
        내 정보를 불러오지 못했어요. 다시 로그인해 주세요.
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">내 정보 수정</h1>
          <p className="text-sm text-gray-400 mt-1">
            닉네임과 프로필 이미지만 변경할 수 있어요.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={
            !canSubmit || !nicknameVerified || updateMeMutation.isPending
          }
          className="bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-lg transition text-sm shadow-sm"
        >
          {updateMeMutation.isPending ? "저장 중..." : "변경사항 저장"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start mb-16">
        <div className="flex flex-col items-center sm:items-start">
          <div className="relative w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-200 shadow-sm">
            <img src="/icons/person.svg" alt="" className="w-14 h-14" />
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm text-gray-600">
              <img src="/icons/edit.svg" alt="" className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 font-medium">
            프로필 이미지
          </p>
          <p className="text-[11px] text-gray-400">선택 사항·최대 5MB</p>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div>
            <label
              htmlFor="nickname"
              className="block text-xs font-semibold text-gray-700 mb-2"
            >
              닉네임
            </label>
            <div className="relative w-full">
              <input
                id="nickname"
                type="text"
                value={nickname}
                disabled={isCheckingNickname}
                onChange={(event) => {
                  setEditedNickname(event.target.value);
                  setCheckedNickname(null);
                }}
                className="w-full pr-24 border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-white"
              />
              <button
                type="button"
                onClick={handleCheckNickname}
                disabled={!canSubmit || isCheckingNickname}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-blue-600"
              >
                {isCheckingNickname ? "확인 중..." : "중복 확인"}
              </button>
            </div>
            {!canSubmit && nickname.length > 0 && (
              <p className="mt-1 text-xs text-red-500">
                닉네임은 2~12자로 입력해 주세요.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-gray-700 mb-2"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={meQuery.data.email}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
            />
          </div>
        </div>
      </div>

      <div className="border border-red-200 bg-red-50/30 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">회원 탈퇴</h3>
          <p className="text-xs text-gray-500">
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
            없습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="border border-red-300 text-red-600 hover:bg-red-50 font-medium px-4 py-2 rounded-lg text-xs transition whitespace-nowrap"
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  );
}
