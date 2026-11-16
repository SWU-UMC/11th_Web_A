// login-page.tsx

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_FORM = {
  email: "",
  password: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  // 이메일과 비밀번호가 모두 입력되었는지 확인
  const isFormValid =
    form.email.trim().length > 0 && form.password.trim().length > 0;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

const loginMutation = useLoginMutation();
const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!canSubmit || loginMutation.isPending) return;

  loginMutation.mutate({
    email: form.email.trim(),
    password: form.password,
  });
};

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-[#f8f9fa] px-4 py-12">
      <div className="w-full max-w-[400px]">
        <h1 className="mb-7 text-[28px] font-bold tracking-tight text-gray-900">
          로그인
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
              {/* 메일 아이콘 */}
              <svg
                className="pointer-events-none absolute left-3.5 h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
                className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#4b6bfb] focus:outline-none"
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold text-gray-800"
            >
              비밀번호
            </label>
            <div className="relative flex items-center">
              {/* 자물쇠 아이콘 */}
              <svg
                className="pointer-events-none absolute left-3.5 h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                id="password"
                type="password"
                placeholder="비밀번호"
                value={form.password}
                onChange={(e) => handleChangeField("password", e.target.value)}
                className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#4b6bfb] focus:outline-none"
              />
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!canSubmit || loginMutation.isPending}
            className="mt-2 h-12 w-full rounded-lg bg-[#4b6bfb] text-sm font-semibold text-white transition-colors hover:bg-[#3b5bdb] disabled:cursor-not-allowed disabled:bg-[#4b6bfb]/40"
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>
        </form>

        {/* 하단 회원가입 이동 안내 */}
        <p className="mt-6 text-center text-xs text-gray-500">
          처음이지신가요?{" "}
          <Link
            to="/signup"
            className="font-medium text-[#4b6bfb] underline underline-offset-2 hover:text-[#3b5bdb]"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}