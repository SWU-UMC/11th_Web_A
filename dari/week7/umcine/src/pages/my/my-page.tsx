import { useState, type SubmitEvent } from "react";

const INITIAL_MEMBER = {
  email: "week7@example.com",
  nickname: "영화팬",
};

export function MyPage() {
  const [member, setMember] = useState(INITIAL_MEMBER);
  const [form, setForm] = useState(INITIAL_MEMBER);
  const [isEditing, setIsEditing] = useState(false);

  const isNicknameValid =
    form.nickname.trim().length >= 2 &&
    form.nickname.trim().length <= 12;

  const handleStartEdit = () => {
    setForm(member);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setForm(member);
    setIsEditing(false);
  };

  const handleSubmit = (
    event: SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!isNicknameValid) {
      return;
    }

    setMember({
      email: form.email.trim(),
      nickname: form.nickname.trim(),
    });

    setIsEditing(false);
    alert("내 정보가 수정되었어요.");
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-64px)] w-[min(720px,calc(100%-48px))] py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">내 정보</h1>
          <p className="mt-2 text-sm text-gray-500">
            회원 정보를 확인하고 수정할 수 있어요.
          </p>
        </div>

        {!isEditing && (
          <button
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold"
            type="button"
            onClick={handleStartEdit}
          >
            정보 수정
          </button>
        )}
      </div>

      <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {isEditing ? (
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                className="mb-2 block text-sm font-bold"
                htmlFor="my-email"
              >
                이메일
              </label>

              <input
                id="my-email"
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500 outline-none"
                type="email"
                value={form.email}
                readOnly
              />

              <p className="mt-2 text-xs text-gray-400">
                이메일은 수정할 수 없어요.
              </p>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-bold"
                htmlFor="my-nickname"
              >
                닉네임
              </label>

              <input
                id="my-nickname"
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  isNicknameValid
                    ? "border-gray-300 focus:border-blue-600"
                    : "border-red-500"
                }`}
                type="text"
                value={form.nickname}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    nickname: event.target.value,
                  }))
                }
              />

              {!isNicknameValid && (
                <p className="mt-2 text-sm text-red-600">
                  닉네임은 2자 이상 12자 이하로 입력해 주세요.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-bold"
                type="button"
                onClick={handleCancelEdit}
              >
                취소
              </button>

              <button
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                type="submit"
                disabled={!isNicknameValid}
              >
                저장
              </button>
            </div>
          </form>
        ) : (
          <dl className="flex flex-col gap-7">
            <div>
              <dt className="text-sm font-bold text-gray-500">
                이메일
              </dt>
              <dd className="mt-2 text-lg font-semibold">
                {member.email}
              </dd>
            </div>

            <div className="border-t border-gray-100 pt-7">
              <dt className="text-sm font-bold text-gray-500">
                닉네임
              </dt>
              <dd className="mt-2 text-lg font-semibold">
                {member.nickname}
              </dd>
            </div>
          </dl>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-8">
        <h2 className="text-lg font-bold">활동 정보</h2>
        <p className="mt-3 text-sm text-gray-500">
          로그인과 실제 회원 정보 API는 8주차에 연결할
          예정이에요.
        </p>
      </section>
    </main>
  );
}