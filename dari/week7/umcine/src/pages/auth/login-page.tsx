import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit =
    email.trim().length > 0 && password.length > 0;

  const handleSubmit = (
    event: SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    alert("로그인 API는 8주차에 연결할 예정이에요.");
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] w-[min(440px,calc(100%-48px))] flex-col justify-center pb-20">
      <h1 className="text-center text-3xl font-bold">
        로그인
      </h1>

      <p className="mt-3 text-center text-sm text-gray-500">
        UMCine에 로그인하고 영화 취향을 기록해 보세요.
      </p>

      <form
        className="mt-10 flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        <div>
          <label
            className="mb-2 block text-sm font-bold"
            htmlFor="login-email"
          >
            이메일
          </label>

          <input
            id="login-email"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            type="email"
            placeholder="이메일을 입력해 주세요."
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-bold"
            htmlFor="login-password"
          >
            비밀번호
          </label>

          <input
            id="login-password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />
        </div>

        <button
          className="mt-2 rounded-lg bg-blue-600 py-3.5 font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          type="submit"
          disabled={!canSubmit}
        >
          로그인
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        아직 회원이 아니신가요?{" "}
        <Link
          className="font-bold text-blue-600"
          to="/signup"
        >
          회원가입
        </Link>
      </p>
    </main>
  );
}