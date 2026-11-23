import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import "./signup-page.css";

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

type FormState = typeof DEFAULT_FORM;
type FieldName = keyof FormState;
type DuplicateCheckKey = "email" | "nickname";

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

const ERROR_MESSAGES: Record<FieldName, string> = {
  email: "이메일 형식을 확인해 주세요.",
  nickname: "닉네임은 2~12자로 입력해 주세요.",
  password: "비밀번호를 다시 한 번 확인해주세요.",
  passwordConfirm: "비밀번호가 일치하지 않아요.",
};

function validate(form: FormState) {
  const nicknameLength = form.nickname.trim().length;
  return {
    email: !EMAIL_REGEX.test(form.email),
    nickname: nicknameLength < 2 || nicknameLength > 12,
    password: !PASSWORD_REGEX.test(form.password),
    passwordConfirm: !form.passwordConfirm || form.password !== form.passwordConfirm,
  } satisfies Record<FieldName, boolean>;
}

export function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  const invalid = validate(form);
  const isEmailValid = !invalid.email;
  const isNicknameValid = !invalid.nickname;
  const isFormValid = !Object.values(invalid).some(Boolean);
  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  // 입력을 시작한 뒤 조건을 만족하지 못하면 바로 에러를 보여줌
  function errorOf(name: FieldName) {
    return form[name] !== "" && invalid[name] ? ERROR_MESSAGES[name] : null;
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const key = event.target.name as FieldName;
    const { value } = event.target;
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCheckDuplicate(key: DuplicateCheckKey) {
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
  }

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
      void navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailError = errorOf("email");
  const nicknameError = errorOf("nickname");
  const passwordError = errorOf("password");
  const passwordConfirmError = errorOf("passwordConfirm");

  return (
    <main className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit} noValidate>
        <h1>회원가입</h1>

        <div className="signup-field">
          <label htmlFor="signup-email">이메일</label>
          <div className="signup-input">
            <input id="signup-email" name="email" type="email" autoComplete="email" placeholder="name@example.com"
              value={form.email} onChange={handleChange} aria-invalid={Boolean(emailError)} />
            <button
              type="button"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {emailError ? <p className="signup-message signup-message--error">{emailError}</p> : null}
        </div>

        <div className="signup-field">
          <label htmlFor="signup-nickname">닉네임</label>
          <div className="signup-input">
            <input id="signup-nickname" name="nickname" type="text" autoComplete="nickname" placeholder="2~12자"
              value={form.nickname} onChange={handleChange} aria-invalid={Boolean(nicknameError)} />
            <button
              type="button"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {nicknameError ? <p className="signup-message signup-message--error">{nicknameError}</p> : null}
        </div>

        <div className="signup-field">
          <label htmlFor="signup-password">비밀번호</label>
          <div className="signup-input">
            <input id="signup-password" name="password" type="password" autoComplete="new-password" placeholder="8자 이상"
              value={form.password} onChange={handleChange} aria-invalid={Boolean(passwordError)} />
          </div>
          <p className="signup-hint">영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요</p>
          {passwordError && <p className="signup-message signup-message--error">{passwordError}</p>}
        </div>

        <div className="signup-field">
          <label htmlFor="signup-password-confirm">비밀번호 확인</label>
          <div className="signup-input">
            <input id="signup-password-confirm" name="passwordConfirm" type="password" autoComplete="new-password" placeholder="다시 입력"
              value={form.passwordConfirm} onChange={handleChange} aria-invalid={Boolean(passwordConfirmError)} />
          </div>
          {passwordConfirmError && <p className="signup-message signup-message--error">{passwordConfirmError}</p>}
        </div>

        <button className="signup-submit" type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>

        <p className="signup-login">
          이미 계정이 있나요? <Link to="/login">로그인</Link>
        </p>
      </form>
    </main>
  );
}
