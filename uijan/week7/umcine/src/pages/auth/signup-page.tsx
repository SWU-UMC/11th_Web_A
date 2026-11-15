import { useState } from "react";
import { Link } from "@tanstack/react-router"; // /login 라우트 생성 후 주석 해제
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
//import { useNavigate } from "@tanstack/react-router";

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

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];
type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
// const navigate = useNavigate();

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

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());
      const isAvailable = response.available;
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable },
      }));
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!canSubmit || isSubmitting) return;

  setIsSubmitting(true);
  try {
    const response = await signup({
      email: form.email.trim(),
      nickname: form.nickname.trim(),
      password: form.password,
    });
    alert(response.message);
    // 로그인 페이지 연결 후 주석 해제
    // navigate({ to: "/login" });
  } catch {
    alert("회원가입에 실패했어요. 다시 시도해 주세요.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-[#f8f9fa] px-4 py-12">
      <div className="w-full max-w-[400px]">
        <h1 className="mb-7 text-[28px] font-bold tracking-tight text-gray-900">
          회원가입
        </h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* 이메일 */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold text-gray-800"
            >
              이메일
            </label>
            <div className="relative flex items-center">
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
                disabled={duplicateCheck.email.isChecking}
                className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-3.5 pr-20 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#4b6bfb] focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
              />
              <button
                type="button"
                disabled={!isEmailValid || duplicateCheck.email.isChecking}
                onClick={() => handleCheckDuplicate("email")}
                className="absolute right-3.5 text-xs font-semibold text-[#4b6bfb] hover:text-[#3b5bdb] disabled:cursor-not-allowed disabled:text-gray-300"
              >
                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showEmailError && (
              <p className="mt-1.5 text-[11px] text-red-500">
                올바른 이메일 형식을 입력해 주세요.
              </p>
            )}
          </div>

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
                value={form.nickname}
                onChange={(e) => handleChangeField("nickname", e.target.value)}
                disabled={duplicateCheck.nickname.isChecking}
                className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-3.5 pr-20 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#4b6bfb] focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
              />
              <button
                type="button"
                disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
                onClick={() => handleCheckDuplicate("nickname")}
                className="absolute right-3.5 text-xs font-semibold text-[#4b6bfb] hover:text-[#3b5bdb] disabled:cursor-not-allowed disabled:text-gray-300"
              >
                {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showNicknameError && (
              <p className="mt-1.5 text-[11px] text-red-500">
                닉네임은 2~12자 이내로 입력해 주세요.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold text-gray-800"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              placeholder="8자 이상"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              className="h-12 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#4b6bfb] focus:outline-none"
            />
            <p
              className={`mt-1.5 text-[11px] ${
                showPasswordError ? "text-red-500" : "text-gray-400"
              }`}
            >
              영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
            </p>
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label
              htmlFor="passwordConfirm"
              className="mb-1.5 block text-xs font-semibold text-gray-800"
            >
              비밀번호 확인
            </label>
            <input
              id="passwordConfirm"
              type="password"
              placeholder="다시 입력"
              value={form.passwordConfirm}
              onChange={(e) =>
                handleChangeField("passwordConfirm", e.target.value)
              }
              className="h-12 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#4b6bfb] focus:outline-none"
            />
            {showPasswordConfirmError && (
              <p className="mt-1.5 text-[11px] text-red-500">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          {/* 가입하기 버튼 */}
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="mt-2 h-12 w-full rounded-lg bg-[#4b6bfb] text-sm font-semibold text-white transition-colors hover:bg-[#3b5bdb] disabled:cursor-not-allowed disabled:bg-[#4b6bfb]/40"
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </form>

        {/* 하단 로그인 이동 안내 */}
        <p className="mt-6 text-center text-xs text-gray-500">
          이미 계정이 있나요?{" "}
          {
          <Link
            to="/login"
            className="font-medium text-[#4b6bfb] underline underline-offset-2 hover:text-[#3b5bdb]"
          >
            로그인
          </Link>
          }
        </p>
      </div>
    </div>
  );
}