import { isHTTPError } from "ky";
import { useState } from "react";
import { checkEmail, checkNickname, getMemberRatings } from "../../api/members/members-api";

interface ApiRowProps {
  label: string;
  defaultValue: string;
  request: (value: string) => Promise<unknown>;
}

function ApiRow({ label, defaultValue, request }: ApiRowProps) {
  const [value, setValue] = useState(defaultValue);
  const [result, setResult] = useState("");

  async function handleClick() {
    try {
      const response = await request(value);
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(isHTTPError(error) ? `${error.response.status} 에러` : "요청 실패");
    }
  }

  return (
    <section className="border-b border-[#e3e6eb] py-6">
      <h2 className="text-[16px] font-bold">{label}</h2>
      <div className="mt-2 flex gap-2">
        <input
          className="h-10 flex-1 rounded-lg border border-[#e3e6eb] px-3 text-[14px]"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button
          className="h-10 cursor-pointer rounded-lg bg-[#17191e] px-4 text-[14px] font-bold text-white"
          type="button"
          onClick={handleClick}
        >
          요청
        </button>
      </div>
      {result && (
        <pre className="mt-2 overflow-x-auto rounded-lg bg-[#f5f6f8] p-3 text-[12px]">{result}</pre>
      )}
    </section>
  );
}

export function MembersApiPage() {
  return (
    <main className="mx-auto max-w-[640px] px-4 py-6 text-[#17191e]">
      <h1 className="text-[28px] font-bold">회원 API</h1>
      <ApiRow label="닉네임 중복 체크" defaultValue="수현" request={checkNickname} />
      <ApiRow label="이메일 중복 체크" defaultValue="noco@umc.com" request={checkEmail} />
      <ApiRow label="유저별 평점 조회" defaultValue="1" request={getMemberRatings} />
    </main>
  );
}