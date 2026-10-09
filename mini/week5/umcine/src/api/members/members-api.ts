import ky from "ky";

const apiClient = ky.create({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}/`,
});

function checkNickname(nickname: string) {
  return apiClient.get(`members/nickname/${encodeURIComponent(nickname)}`).json();
}

function checkEmail(email: string) {
  return apiClient.get(`members/email/${encodeURIComponent(email)}`).json();
}

function getMemberRatings(memberId: string) {
  return apiClient.get(`members/${memberId}/ratings`).json();
}

export { checkEmail, checkNickname, getMemberRatings };