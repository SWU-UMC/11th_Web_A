type MemberRole = "leader" | "member";

interface StudyMember {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
}

const members: StudyMember[] = [
  {
    id: 1,
    name: "광수",
    role: "leader",
    githubId: "gwangsoo",
  },
  {
    id: 2,
    name: "지수",
    role: "member",
  },
];

function getMemberInfo(memberId: number): string {
  const member = members.find(
    (member) => member.id === memberId
  );

  if (!member) {
    return "회원을 찾을 수 없어요.";
  }

  const githubId = member.githubId ?? "등록되지 않음";

  return (
    "이름: " + member.name + " / 역할: " + member.role + " / GitHub: " + githubId
  );
}

console.log(getMemberInfo(1));
console.log(getMemberInfo(2));
console.log(getMemberInfo(999));