import { useState } from "react";
import { checkEmailDuplicate } from "@/api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";

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

// 공통 스타일
const labelClass = "mb-2 block text-sm font-bold text-gray-900";
const inputClass =
  "h-12 w-full rounded-xl border bg-white px-4 text-base text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-blue-600";
const checkButtonClass =
  "absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-blue-600 hover:text-blue-700";
const errorClass = "mt-1.5 text-xs text-red-500";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

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
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
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

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();

    // 3.4에서 회원가입 API 요청 추가
  };

  // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
  return (
    // 헤더 높이(약 70px)를 뺀 영역에서 폼을 가운데 정렬
    <div className="flex min-h-[calc(100vh-70px)] items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <h1 className="mb-5 text-3xl font-extrabold tracking-tight text-gray-900">
          회원가입
        </h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5"
        >
          {/* 이메일 */}
          <div>
            <label htmlFor="email" className={labelClass}>
              이메일
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                disabled={duplicateCheck.email.isChecking}
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
                className={`${inputClass} pr-24 ${
                  showEmailError ? "border-red-500" : "border-gray-200"
                }`}
              />
              <button
                type="button"
                className={checkButtonClass}
                disabled={!isEmailValid || duplicateCheck.email.isChecking}
                onClick={() => handleCheckDuplicate("email")}
              >
                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showEmailError && (
              <p className={errorClass}>이메일 형식을 확인해 주세요.</p>
            )}
          </div>

          {/* 닉네임 */}
          <div>
            <label htmlFor="nickname" className={labelClass}>
              닉네임
            </label>
            <div className="relative">
              <input
                id="nickname"
                type="text"
                placeholder="2–12자"
                disabled={duplicateCheck.nickname.isChecking}
                value={form.nickname}
                onChange={(e) => handleChangeField("nickname", e.target.value)}
                className={`${inputClass} pr-24 ${
                  showNicknameError ? "border-red-500" : "border-gray-200"
                }`}
              />
              <button
                type="button"
                className={checkButtonClass}
                disabled={!isEmailValid || duplicateCheck.nickname.isChecking}
                onClick={() => handleCheckDuplicate("nickname")}
              >
                {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showNicknameError && (
              <p className={errorClass}>닉네임은 2~12자로 입력해 주세요</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="password" className={labelClass}>
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              placeholder="8자 이상"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              className={`${inputClass} ${
                showPasswordError ? "border-red-500" : "border-gray-200"
              }`}
            />
            {/* 힌트는 항상 회색 */}
            <p className="mt-1.5 text-xs text-gray-400">
              영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해
              주세요
            </p>
            {/* 에러는 힌트 아래에 별도로 표시 */}
            {showPasswordError && (
              <p className="mt-1.5 text-xs text-red-600">
                비밀번호를 다시 한 번 확인해주세요.
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label htmlFor="passwordConfirm" className={labelClass}>
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
              className={`${inputClass} ${
                showPasswordConfirmError ? "border-red-500" : "border-gray-200"
              }`}
            />
            {showPasswordConfirmError && (
              <p className={errorClass}>비밀번호가 일치하지 않아요</p>
            )}
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="h-12 w-full rounded-xl bg-blue-600 text-base font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed"
          >
            가입하기
          </button>

          {/* 로그인 링크 */}
          <p className="text-center text-sm text-gray-500">
            이미 계정이 있나요?{" "}
            <a
              href="/login"
              className="font-bold text-blue-600 hover:underline"
            >
              로그인
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
