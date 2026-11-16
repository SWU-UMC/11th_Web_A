import { useState } from "react";
import { login } from "../../api/members/login";
import { useNavigate } from "@tanstack/react-router";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isPasswordValid = PASSWORD_REGEX.test(form.password);

  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;

  const isFormValid = isEmailValid && isPasswordValid;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await login({
        email: form.email.trim(),
        password: form.password,
      });
      alert(response.message);
      navigate({ to: "/signup" });
    } catch {
      alert("로그인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8">
      {/* 타이틀 */}
      <h1 className="text-3xl font-bold mb-8 text-gray-900">로그인</h1>
      {/* 로그인 폼 */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md flex flex-col gap-5"
      >
        {/* 이메일 입력 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-800">이메일</label>
          <div className="relative flex items-center">
            <img
              src="../../public/icons/mail.svg"
              alt="mail icon"
              className="absolute left-3 w-5 h-5 text-gray-200 pointer-events-none"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              placeholder="name@example.com"
              className={`flex-1 border rounded-lg p-3 pl-10 outline-none text-sm ${
                showEmailError
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
          </div>
          {showEmailError && (
            <span className="text-xs text-red-500">
              올바른 이메일 형식을 입력해 주세요.
            </span>
          )}
        </div>
        {/* 비밀번호 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-800">
            비밀번호
          </label>
          <div className="relative flex items-center">
            <img
              src="../../public/icons/lock.svg"
              alt="lock icon"
              className="absolute left-3 w-5 h-5 text-gray-200 pointer-events-none"
            />
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              placeholder="비밀번호"
              className={`flex-1 border rounded-lg p-3 pl-10 outline-none text-sm ${
                showPasswordError
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-3.5 rounded-lg font-semibold text-white transition mt-2 ${
            isFormValid
              ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              : "bg-blue-300 cursor-not-allowed"
          }`}
        >
          로그인
        </button>
        <div className="text-center mt-2 text-sm text-gray-600">
          처음이신가요?{" "}
          <a
            href="/signup"
            className=" text-blue-600 hover:underline font-medium"
          >
            회원가입
          </a>
        </div>
      </form>
    </div>
  );
}
