import { useState, type SubmitEvent } from "react";
import {
  checkEmail,
  checkNickname,
} from "../../api/members";
import { signup } from "../../api/members/signup";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());

  const isNicknameValid =
    form.nickname.trim().length >= 2 &&
    form.nickname.trim().length <= 12;

  const isPasswordValid = PASSWORD_REGEX.test(form.password);

  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 &&
    form.password === form.passwordConfirm;

  const showEmailError =
    form.email.length > 0 && !isEmailValid;

  const showNicknameError =
    form.nickname.length > 0 && !isNicknameValid;

  const showPasswordError =
    form.password.length > 0 && !isPasswordValid;

  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 &&
    !isPasswordConfirmValid;

  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (
    key: DefaultFormKey,
    value: DefaultFormValue,
  ) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) {
        return;
      }

      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
    }

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCheckDuplicate = async (
    key: DuplicateCheckKey,
  ) => {
    const isValid =
      key === "email" ? isEmailValid : isNicknameValid;

    if (!isValid || duplicateCheck[key].isChecking) {
      return;
    }

    const label = key === "email" ? "이메일" : "닉네임";

    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: {
        isChecking: true,
        isAvailable: false,
      },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmail(form.email.trim())
          : await checkNickname(form.nickname.trim());

      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
          isChecking: false,
          isAvailable: response.available,
        },
      }));

      alert(
        response.available
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));

      alert(
        "중복 확인에 실패했어요. 다시 시도해 주세요.",
      );
    }
  };

  const handleSubmit = async (
    event: SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });

      alert(response.message);
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] w-[min(520px,calc(100%-48px))] flex-col py-12">
      <h1 className="text-center text-3xl font-bold">
        회원가입
      </h1>

      <p className="mt-3 text-center text-sm text-gray-500">
        UMCine에서 영화 취향을 기록해 보세요.
      </p>

      <form
        className="mt-10 flex flex-col gap-6"
        onSubmit={handleSubmit}
        noValidate
      >
        <div>
          <label
            className="mb-2 block text-sm font-bold"
            htmlFor="email"
          >
            이메일
          </label>

          <div className="flex gap-2">
            <input
              id="email"
              className={`min-w-0 flex-1 rounded-lg border px-4 py-3 outline-none ${
                showEmailError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-600"
              }`}
              type="email"
              placeholder="이메일을 입력해 주세요."
              value={form.email}
              disabled={duplicateCheck.email.isChecking}
              onChange={(event) =>
                handleChangeField(
                  "email",
                  event.target.value,
                )
              }
            />

            <button
              className="shrink-0 rounded-lg bg-gray-900 px-4 font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
              type="button"
              disabled={
                !isEmailValid ||
                duplicateCheck.email.isChecking
              }
              onClick={() => handleCheckDuplicate("email")}
            >
              {duplicateCheck.email.isChecking
                ? "확인 중"
                : "중복 확인"}
            </button>
          </div>

          {showEmailError && (
            <p className="mt-2 text-sm text-red-600">
              올바른 이메일 형식으로 입력해 주세요.
            </p>
          )}

          {duplicateCheck.email.isAvailable && (
            <p className="mt-2 text-sm text-green-600">
              사용할 수 있는 이메일이에요.
            </p>
          )}
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-bold"
            htmlFor="nickname"
          >
            닉네임
          </label>

          <div className="flex gap-2">
            <input
              id="nickname"
              className={`min-w-0 flex-1 rounded-lg border px-4 py-3 outline-none ${
                showNicknameError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-600"
              }`}
              type="text"
              placeholder="2자 이상 12자 이하로 입력해 주세요."
              value={form.nickname}
              disabled={duplicateCheck.nickname.isChecking}
              onChange={(event) =>
                handleChangeField(
                  "nickname",
                  event.target.value,
                )
              }
            />

            <button
              className="shrink-0 rounded-lg bg-gray-900 px-4 font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
              type="button"
              disabled={
                !isNicknameValid ||
                duplicateCheck.nickname.isChecking
              }
              onClick={() =>
                handleCheckDuplicate("nickname")
              }
            >
              {duplicateCheck.nickname.isChecking
                ? "확인 중"
                : "중복 확인"}
            </button>
          </div>

          {showNicknameError && (
            <p className="mt-2 text-sm text-red-600">
              닉네임은 2자 이상 12자 이하로 입력해 주세요.
            </p>
          )}

          {duplicateCheck.nickname.isAvailable && (
            <p className="mt-2 text-sm text-green-600">
              사용할 수 있는 닉네임이에요.
            </p>
          )}
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-bold"
            htmlFor="password"
          >
            비밀번호
          </label>

          <input
            id="password"
            className={`w-full rounded-lg border px-4 py-3 outline-none ${
              showPasswordError
                ? "border-red-500"
                : "border-gray-300 focus:border-blue-600"
            }`}
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            value={form.password}
            onChange={(event) =>
              handleChangeField(
                "password",
                event.target.value,
              )
            }
          />

          {showPasswordError && (
            <p className="mt-2 text-sm text-red-600">
              대문자, 소문자, 숫자, 특수문자를 포함한 8자
              이상이어야 해요.
            </p>
          )}
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-bold"
            htmlFor="passwordConfirm"
          >
            비밀번호 확인
          </label>

          <input
            id="passwordConfirm"
            className={`w-full rounded-lg border px-4 py-3 outline-none ${
              showPasswordConfirmError
                ? "border-red-500"
                : "border-gray-300 focus:border-blue-600"
            }`}
            type="password"
            placeholder="비밀번호를 다시 입력해 주세요."
            value={form.passwordConfirm}
            onChange={(event) =>
              handleChangeField(
                "passwordConfirm",
                event.target.value,
              )
            }
          />

          {showPasswordConfirmError && (
            <p className="mt-2 text-sm text-red-600">
              비밀번호가 일치하지 않아요.
            </p>
          )}
        </div>

        <button
          className="mt-2 rounded-lg bg-blue-600 py-3.5 font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          type="submit"
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>
      </form>
    </main>
  );
}