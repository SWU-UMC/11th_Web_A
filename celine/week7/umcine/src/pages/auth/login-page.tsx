import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";
import "./signup-page.css";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [form, setForm] = useState({ email: "", password: "" });

  const emailError = form.email !== "" && !EMAIL_REGEX.test(form.email) ? "이메일 형식을 확인해 주세요." : null;
  const canSubmit = EMAIL_REGEX.test(form.email) && form.password !== "";

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    // 백엔드가 없으므로 형식만 맞으면 로그인 처리 (닉네임은 이메일 앞부분 사용)
    login({ email: form.email, nickname: form.email.split("@")[0] });
    void navigate({ to: "/" });
  }

  return (
    <main className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit} noValidate>
        <h1>로그인</h1>

        <div className="signup-field">
          <label htmlFor="login-email">이메일</label>
          <div className="signup-input">
            <img className="signup-input__icon" src="/icons/movie-icons/movie-icons/mail.svg" alt="" />
            <input id="login-email" name="email" type="email" autoComplete="email" placeholder="name@example.com"
              value={form.email} onChange={handleChange} aria-invalid={Boolean(emailError)} />
          </div>
          {emailError && <p className="signup-message signup-message--error">{emailError}</p>}
        </div>

        <div className="signup-field">
          <label htmlFor="login-password">비밀번호</label>
          <div className="signup-input">
            <img className="signup-input__icon" src="/icons/movie-icons/movie-icons/lock.svg" alt="" />
            <input id="login-password" name="password" type="password" autoComplete="current-password" placeholder="비밀번호"
              value={form.password} onChange={handleChange} />
          </div>
        </div>

        <button className="signup-submit" type="submit" disabled={!canSubmit}>로그인</button>

        <p className="signup-login">
          처음이신가요? <Link to="/signup">회원가입</Link>
        </p>
      </form>
    </main>
  );
}
