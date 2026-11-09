import { useState } from "react";
import {
  checkEmail,
  checkNickname,
  getMemberRatings,
  type CheckResponse,
  type RatingResponse,
} from "../api/members";

export function BackendApiTestPage() {
  const [nicknameResult, setNicknameResult] =
    useState<CheckResponse | null>(null);
  const [emailResult, setEmailResult] =
    useState<CheckResponse | null>(null);
  const [ratings, setRatings] = useState<RatingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleTestApis() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [nickname, email, memberRatings] = await Promise.all([
        checkNickname("수현"),
        checkEmail("noco@umc.com"),
        getMemberRatings(1),
      ]);

      setNicknameResult(nickname);
      setEmailResult(email);
      setRatings(memberRatings);
    } catch {
      setErrorMessage("백엔드 API 요청에 실패했어요.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-64px)] w-[min(900px,calc(100%-48px))] py-10">
      <h1 className="text-[28px] font-bold">
        백엔드 API 연결 확인
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        UMCine 화면에서 NestJS API 세 개를 호출합니다.
      </p>

      <button
        className="mt-6 rounded-md bg-blue-600 px-5 py-3 font-bold text-white disabled:opacity-50"
        type="button"
        disabled={isLoading}
        onClick={() => void handleTestApis()}
      >
        {isLoading ? "요청 중..." : "모든 API 호출"}
      </button>

      {errorMessage && (
        <p className="mt-6 text-red-600">{errorMessage}</p>
      )}

      <section className="mt-8 grid gap-5">
        <article className="rounded-lg border border-gray-200 p-5">
          <h2 className="font-bold">닉네임 중복 확인</h2>
          <p className="mt-1 text-sm text-gray-500">
            GET /members/nickname/수현
          </p>
          <pre className="mt-3 overflow-auto rounded bg-gray-100 p-4 text-sm">
            {nicknameResult
              ? JSON.stringify(nicknameResult, null, 2)
              : "요청 전"}
          </pre>
        </article>

        <article className="rounded-lg border border-gray-200 p-5">
          <h2 className="font-bold">이메일 중복 확인</h2>
          <p className="mt-1 text-sm text-gray-500">
            GET /members/email/noco@umc.com
          </p>
          <pre className="mt-3 overflow-auto rounded bg-gray-100 p-4 text-sm">
            {emailResult
              ? JSON.stringify(emailResult, null, 2)
              : "요청 전"}
          </pre>
        </article>

        <article className="rounded-lg border border-gray-200 p-5">
          <h2 className="font-bold">회원별 평점 조회</h2>
          <p className="mt-1 text-sm text-gray-500">
            GET /members/1/ratings
          </p>
          <pre className="mt-3 overflow-auto rounded bg-gray-100 p-4 text-sm">
            {ratings.length > 0
              ? JSON.stringify(ratings, null, 2)
              : "요청 전"}
          </pre>
        </article>
      </section>
    </main>
  );
}