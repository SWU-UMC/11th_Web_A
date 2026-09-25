type StudyMember = {
  id: number;
  name: string;
  role: "leader" | "member";
  githubId?: string;
};

const members: StudyMember[] = [
  { id: 1, name: "광수", role: "leader", githubId: "gwangsoo" },
  { id: 2, name: "지수", role: "member" },
];

const foundMember = (id: number) => {
  const member = members.find((member) => member.id === id);

  if (!member) {
    return "존재하지 않는 회원입니다.";
  } else if (member.githubId) {
    return `${member.id}번 회원은 ${member.name}이고, 깃허브 아이디는 ${member.githubId}입니다.`;
  } else {
    return `${member.id}번 회원은 ${member.name}이고, 깃허브 아이디가 없습니다.`;
  }
};

console.log(foundMember(1));
console.log(foundMember(2));
console.log(foundMember(999));
