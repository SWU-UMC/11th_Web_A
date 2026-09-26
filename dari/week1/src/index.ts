type MemberRole = "leader" | "member";

type StudyMember = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};

const members: StudyMember[] = [
  { id: 1, name: "영은", role: "leader", githubId: "gwangsoo" },
  { id: 2, name: "광수", role: "member" },
];

function getMemberMessage(memberId: number): string {
  const member = members.find((item) => item.id === memberId);

  if (!member) {
    return `ID ${memberId}: 회원을 찾을 수 없어요.`;
  }

  const roleMessage =
    member.role === "leader"
      ? "스터디를 이끌어요."
      : "스터디에 참여해요.";

  const githubMessage = member.githubId
    ? `GitHub: ${member.githubId}`
    : "GitHub 아이디가 없어요.";

  return `${member.name} 님은 ${roleMessage} ${githubMessage}`;
}

console.log(getMemberMessage(1));
console.log(getMemberMessage(2));
console.log(getMemberMessage(999));