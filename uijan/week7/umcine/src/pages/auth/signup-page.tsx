import { useState } from "react";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
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

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효하면 제출 버튼 활성화
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  
  const handleSubmit = (e:React.SubmitEvent<HTMLFormElement>) => {
	  // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault()
    
    // 3.4에서 회원가입 API 요청 추가
  };
  
  // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
  return (
    <main className="min-h-[calc(100vh-76px)] bg-[#f5f6f8] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-[456px]">
        {/* 페이지 제목 */}
        <h1 className="text-[32px] font-bold text-gray-900 mb-5">
          회원가입
        </h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* 이메일 */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              이메일
            </label>

            <div className="flex gap-2 items-center rounded-lg border border-gray-200 bg-white px-4 h-[52px] focus-within:border-[#5063e8]">
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  handleChangeField("email", e.target.value)
                }
                placeholder="name@example.com"
                className="flex-1 min-w-0 outline-none text-sm text-gray-900 placeholder:text-gray-400"
              />

              <button
                type="button"
                disabled={!isEmailValid}
                className="shrink-0 text-sm font-semibold text-[#5063e8] disabled:opacity-40"
              >
                중복 확인
              </button>
            </div>

            {showEmailError && (
              <p className="mt-1.5 text-xs text-red-500">
                올바른 이메일 형식을 입력해 주세요.
              </p>
            )}
          </div>

          {/* 닉네임 */}
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              닉네임
            </label>

            <div className="flex gap-2 items-center rounded-lg border border-gray-200 bg-white px-4 h-[52px] focus-within:border-[#5063e8]">
              <input
                id="nickname"
                type="text"
                value={form.nickname}
                onChange={(e) =>
                  handleChangeField("nickname", e.target.value)
                }
                placeholder="2~12자"
                className="flex-1 min-w-0 outline-none text-sm text-gray-900 placeholder:text-gray-400"
              />

              <button
                type="button"
                disabled={!isNicknameValid}
                className="shrink-0 text-sm font-semibold text-[#5063e8] disabled:opacity-40"
              >
                중복 확인
              </button>
            </div>

            {showNicknameError && (
              <p className="mt-1.5 text-xs text-red-500">
                닉네임은 2~12자로 입력해 주세요.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              비밀번호
            </label>

            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) =>
                handleChangeField("password", e.target.value)
              }
              placeholder="8자 이상"
              className="w-full h-[52px] rounded-lg border border-gray-200 bg-white px-4 outline-none text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#5063e8]"
            />

            <p className="mt-1.5 text-xs text-gray-400">
              영문 대 • 소문자, 숫자, 특수문자(!@#$%^&*) 를 모두 포함해 8자 이상 입력해 주세요.
            </p>

            {showPasswordError && (
              <p className="mt-1.5 text-xs text-red-500">
                비밀번호 조건을 확인해 주세요.
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              비밀번호 확인
            </label>

            <input
              id="passwordConfirm"
              type="password"
              value={form.passwordConfirm}
              onChange={(e) =>
                handleChangeField("passwordConfirm", e.target.value)
              }
              placeholder="다시 입력"
              className="w-full h-[52px] rounded-lg border border-gray-200 bg-white px-4 outline-none text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#5063e8]"
            />

            {showPasswordConfirmError && (
              <p className="mt-1.5 text-xs text-red-500">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full h-[49px] rounded-lg bg-[#5063e8] text-white font-bold text-sm transition-colors hover:bg-[#4053d5] disabled:bg-[#5063e8] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            가입하기
          </button>
        </form>

        {/* 로그인 페이지 이동 */}
        <p className="mt-4 text-center text-sm text-gray-500">
          이미 계정이 있나요?{" "}
          <a
            href="/login"
            className="font-semibold text-[#5063e8] hover:underline"
          >
            로그인
          </a>
        </p>
      </div>
    </main>
  );
}