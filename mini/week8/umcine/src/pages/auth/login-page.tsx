import { useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type FormKey = keyof typeof DEFAULT_FORM;

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  // 입력값의 유효성을 검사해요.
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());

  const isPasswordValid = PASSWORD_REGEX.test(form.password);

  // 입력을 시작한 필드에만 오류를 표시해요.
  const showEmailError =
    form.email.length > 0 && !isEmailValid;

  const showPasswordError =
    form.password.length > 0 && !isPasswordValid;

  // 입력값 변경
  const handleChangeField = (
    key: FormKey,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 로그인
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: 로그인 API 연결 후 인증 실패 시 로그인 버튼 아래에
    // "이메일 또는 비밀번호가 올바르지 않아요."를 표시해요.
  };

  return (
    <main className="flex flex-1 justify-center bg-[#f6f7f9]">
      <section className="w-[430px] py-[306.5px]">
        <h1 className="m-0 mb-[16px] text-[32px] font-bold leading-[41px] text-[#17191e]">
          로그인
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

            <div className="flex h-[49px] w-full items-center overflow-hidden rounded-lg border border-[#e3e6eb] bg-white focus-within:border-[#2563eb]">
              <img
                src="/icons/mail.svg"
                alt=""
                className="ml-4 h-[16px] w-[16px] shrink-0"
              />

              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) =>
                  handleChangeField("email", e.target.value)
                }
                className="min-w-0 flex-1 border-0 bg-transparent px-3 pr-4 text-[14px] font-normal leading-[17px] text-[#17191e] outline-none placeholder:text-[#969da8]"
              />
            </div>

            {showEmailError && (
              <p className="m-0 text-[11px] leading-[13px] text-red-500">
                이메일 형식을 확인해 주세요.
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

            <div className="flex h-[49px] w-full items-center overflow-hidden rounded-lg border border-[#e3e6eb] bg-white focus-within:border-[#2563eb]">
              <img
                src="/icons/lock.svg"
                alt=""
                className="ml-4 h-[16px] w-[16px] shrink-0"
              />

              <input
                id="password"
                type="password"
                placeholder="비밀번호"
                value={form.password}
                onChange={(e) =>
                  handleChangeField("password", e.target.value)
                }
                className="min-w-0 flex-1 border-0 bg-transparent px-3 pr-4 text-[14px] font-normal leading-[17px] text-[#17191e] outline-none placeholder:text-[#969da8]"
              />
            </div>

            {showPasswordError && (
              <p className="m-0 text-[11px] leading-[13px] text-red-500">
                영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요.
              </p>
            )}
          </div>

          {/* 로그인 */}
          <button
            type="submit"
            disabled={!isEmailValid || !isPasswordValid}
            className="h-[48px] w-full rounded-lg border border-[#2563eb] bg-[#2563eb] text-[13px] font-bold text-white disabled:border-[#e3e6eb] disabled:bg-[#e3e6eb] disabled:text-[#969da8]"
          >
            로그인
          </button>
        </form>

        <p className="m-0 mt-[16px] text-center text-[13px] font-normal leading-[16px] text-[#606774]">
          처음이신가요?{" "}
          <a
            href="/signup"
            className="text-[12px] font-extrabold leading-[14px] text-[#2563eb] no-underline"
          >
            회원가입
          </a>
        </p>
      </section>
    </main>
  );
}