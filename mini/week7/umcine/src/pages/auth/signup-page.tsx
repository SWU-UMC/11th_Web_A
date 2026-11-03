import { useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  // 입력값의 유효성을 검사해요.
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());

  const isNicknameValid =
    form.nickname.trim().length >= 2 &&
    form.nickname.trim().length <= 12;

  const isPasswordValid = PASSWORD_REGEX.test(form.password);

  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 &&
    form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류를 표시해요.
  const showEmailError = form.email.length > 0 && !isEmailValid;

  const showNicknameError =
    form.nickname.length > 0 && !isNicknameValid;

  const showPasswordError =
    form.password.length > 0 && !isPasswordValid;

  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효할 때만 가입하기 버튼을 활성화해요.
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const handleChangeField = (
    key: DefaultFormKey,
    value: DefaultFormValue,
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지가 새로고침되지 않도록 해요.
    e.preventDefault();

    // 3.4에서 회원가입 API 요청을 추가해요.
  };

  return (
    <main className="flex flex-1 justify-center bg-[#f6f7f9]">
      <section className="w-[430px] pt-[211.5px]">
        <h1 className="m-0 mb-[16px] text-[32px] font-bold leading-[41px] text-[#17191e]">
          회원가입
        </h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-[16px]"
        >
          {/* 이메일 */}
          <div className="flex flex-col gap-[8px]">
            <label
              htmlFor="email"
              className="text-[13px] font-bold leading-[16px] text-[#17191e]"
            >
              이메일
            </label>

            <div className="flex h-[49px] w-full overflow-hidden rounded-lg border border-[#e3e6eb] bg-white focus-within:border-[#2563eb]">
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) =>
                  handleChangeField("email", e.target.value)
                }
                className="min-w-0 flex-1 border-0 bg-transparent px-4 text-[14px] font-normal leading-[17px] text-[#17191e] outline-none placeholder:text-[#969da8]"
              />

              <button
                type="button"
                className="shrink-0 border-0 bg-transparent px-[13px] text-[12px] font-extrabold leading-[14px] text-[#2563eb]"
              >
                중복 확인
              </button>
            </div>

            {showEmailError && (
              <p className="m-0 text-[11px] leading-[13px] text-red-500">
                이메일 형식을 확인해 주세요.
              </p>
            )}
          </div>

          {/* 닉네임 */}
          <div className="flex flex-col gap-[8px]">
            <label
              htmlFor="nickname"
              className="text-[13px] font-bold leading-[16px] text-[#17191e]"
            >
              닉네임
            </label>

            <div className="flex h-[49px] w-full overflow-hidden rounded-lg border border-[#e3e6eb] bg-white focus-within:border-[#2563eb]">
              <input
                id="nickname"
                type="text"
                placeholder="2–12자"
                value={form.nickname}
                onChange={(e) =>
                  handleChangeField("nickname", e.target.value)
                }
                className="min-w-0 flex-1 border-0 bg-transparent px-4 text-[14px] font-normal leading-[17px] text-[#17191e] outline-none placeholder:text-[#969da8]"
              />

              <button
                type="button"
                className="shrink-0 border-0 bg-transparent px-[13px] text-[12px] font-extrabold leading-[14px] text-[#2563eb]"
              >
                중복 확인
              </button>
            </div>

            {showNicknameError && (
              <p className="m-0 text-[11px] leading-[13px] text-red-500">
                닉네임은 2~12자로 입력해 주세요.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-[8px]">
            <label
              htmlFor="password"
              className="text-[13px] font-bold leading-[16px] text-[#17191e]"
            >
              비밀번호
            </label>

            <input
              id="password"
              type="password"
              placeholder="8자 이상"
              value={form.password}
              onChange={(e) =>
                handleChangeField("password", e.target.value)
              }
              className="h-[49px] w-full rounded-lg border border-[#e3e6eb] bg-white px-4 text-[14px] font-normal leading-[17px] text-[#17191e] outline-none placeholder:text-[#969da8] focus:border-[#2563eb]"
            />

            {showPasswordError && (
              <p className="m-0 text-[11px] leading-[13px] text-red-500">
                비밀번호를 다시 한 번 확인해 주세요.
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col gap-[8px]">
            <label
              htmlFor="passwordConfirm"
              className="text-[13px] font-bold leading-[16px] text-[#17191e]"
            >
              비밀번호 확인
            </label>

            <input
              id="passwordConfirm"
              type="password"
              placeholder="다시 입력"
              value={form.passwordConfirm}
              onChange={(e) =>
                handleChangeField(
                  "passwordConfirm",
                  e.target.value,
                )
              }
              className="h-[49px] w-full rounded-lg border border-[#e3e6eb] bg-white px-4 text-[14px] font-normal leading-[17px] text-[#17191e] outline-none placeholder:text-[#969da8] focus:border-[#2563eb]"
            />

            {showPasswordConfirmError && (
              <p className="m-0 text-[11px] leading-[13px] text-red-500">
                비밀번호가 일치하지 않아요.
              </p>
            )}
          </div>

          {/* 가입하기 */}
          <button
            type="submit"
            disabled={!isFormValid}
            className="h-[48px] w-full rounded-lg border border-[#2563eb] bg-[#2563eb] text-[13px] font-bold text-white disabled:border-[#e3e6eb] disabled:bg-[#e3e6eb] disabled:text-[#969da8]"
          >
            가입하기
          </button>
        </form>

        <p className="m-0 mt-[16px] text-center text-[13px] font-normal leading-[16px] text-[#606774]">
          이미 계정이 있나요?{" "}
          <a
            href="/login"
            className="text-[12px] font-extrabold leading-[14px] text-[#2563eb] no-underline"
          >
            로그인
          </a>
        </p>
      </section>
    </main>
  );
}