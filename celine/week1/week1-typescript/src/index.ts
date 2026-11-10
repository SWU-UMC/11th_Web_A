type MemberRole = "leader" | "member";

type StudyMember = {
  name: string;
  id: number;
  role: MemberRole;
  githubId?: string;
};

const members: StudyMember[] = [
  { 
    id: 1, 
    name: "광수", 
    role: "member", 
    githubId: "gwangsoo" },
  { 
    id :2,
    name: "지수",
    role: "member" 
  },
];

function findMember(memberId: number): string {
  const member = members.find((member) => member.id === memberId);

  if (!member) {
    return "존재하지 않는 회원입니다.";
  }

  const githubId = member.githubId ?? "GitHub ID 없음";

  return `${member.name} / ${member.role} / ${githubId}`;
}

console.log(findMember(1));
console.log(findMember(2));
console.log(findMember(999));