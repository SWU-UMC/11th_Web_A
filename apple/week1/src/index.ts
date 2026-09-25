// 1. 회원의 ID, 이름, 역할, GitHub 아이디(선택 값)을 타입으로 표현
type MemberRole = "leader" | "member";

type StudyMember = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};

// 1. 서로 다른 정보를 가진 회원 2명
const members: StudyMember[] = [
  { id: 1, name: "닉네임/홍길동", role: "leader" }, // githubId 없음
  { id: 2, name: "애플/이석현", role: "member", githubId: "LEle-donut91" },
];

// 2. 회원 ID로 정보를 찾아 안내 문구를 만드는 함수
function introduceMember(id: number): string {
  const member = members.find((m) => m.id === id);

  // 존재하지 않는 회원 처리
  if (!member) {
    return `${id}번 회원을 찾을 수 없어요.`;
  }

  const roleText = member.role === "leader" ? "리더" : "멤버";

  // GitHub 아이디가 있는 경우와 없는 경우를 구분하여 안내 문구 작성
  const githubText = member.githubId
    ? `GitHub: ${member.githubId}`
    : "GitHub 아이디 없음";

  return `${member.name} 님은 이 스터디의 ${roleText}예요. (${githubText})`;
}

// 3. 회원 ID 1, 2, 999를 전달한 결과를 확인
console.log(introduceMember(1));
console.log(introduceMember(2));
console.log(introduceMember(999));
