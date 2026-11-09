import { useState } from "react";

export function MyPageEdit() {
  // 폼 상태 관리 (닉네임, 이메일, 프로필 이미지 등)
  const [form, setForm] = useState({
    nickname: "gs0428",
    email: "gwangsoo@cinemalab.kr",
  });

  const handleChangeField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // 닉네임 중복 확인 핸들러 (기존 회원가입 로직 응용 가능)
  const handleCheckDuplicate = () => {
    alert("사용 가능한 닉네임입니다.");
  };

  // 변경사항 저장 핸들러
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("변경사항이 저장되었습니다!");
  };

  // 회원 탈퇴 핸들러
  const handleDeleteAccount = () => {
    if (
      confirm(
        "정말 탈퇴하시겠습니까? 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.",
      )
    ) {
      alert("회원 탈퇴가 완료되었습니다.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* 1. 상단 타이틀 및 저장 버튼 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">내 정보 수정</h1>
          <p className="text-sm text-gray-400 mt-1">
            닉네임과 프로필 이미지만 변경할 수 있어요.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition text-sm shadow-sm"
        >
          변경사항 저장
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start mb-16">
        {/* 2. 프로필 이미지 섹션 */}
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

        {/* 3. 입력 폼 섹션 (닉네임 & 이메일) */}
        <div className="md:col-span-2 space-y-6">
          {/* 닉네임 입력 및 중복 확인 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              닉네임
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={form.nickname}
                onChange={(e) => handleChangeField("nickname", e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-white"
              />
              <button
                type="button"
                onClick={handleCheckDuplicate}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                중복 확인
              </button>
            </div>
          </div>

          {/* 이메일 (수정 불가 필드) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. 하단 회원 탈퇴 섹션 */}
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
