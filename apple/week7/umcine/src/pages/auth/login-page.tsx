import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const labelClass = "mb-2 block text-sm font-bold text-gray-900";
const inputWrapperClass = "relative";
const inputClass =
  "h-11 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-blue-600";
const iconClass =
  "pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 opacity-60";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const canSubmit = isEmailValid && form.password.length > 0;

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    // TODO: 로그인 API 연결 시 이 부분을 API 호출로 교체
    login(form.email.trim());
    navigate({ to: "/my_page" });
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-96">
        <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-gray-900">
          로그인
        </h1>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className={labelClass}>이메일</label>
            <div className={inputWrapperClass}>
              <img src="/icons/mail.svg" alt="" className={iconClass} />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>비밀번호</label>
            <div className={inputWrapperClass}>
              <img src="/icons/lock.svg" alt="" className={iconClass} />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="비밀번호"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 h-11 w-full rounded-lg bg-blue-600 text-[15px] font-bold text-white transition-colors disabled:cursor-not-allowed"
          >
            로그인
          </button>

          <p className="mt-2 text-center text-sm text-gray-500">
            처음이신가요?{" "}
            <Link to="/signup" className="font-bold text-blue-600 hover:underline">
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
