import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setAccessToken(response.result.accessToken);
      alert("로그인에 성공했어요.");
      queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      // 즐겨찾기와 평점은 회원마다 다르므로 이전 계정의 캐시가 보이지 않게 지워요.
      queryClient.removeQueries({ queryKey: ["favorites"] });
      queryClient.removeQueries({ queryKey: ["ratings"] });
      navigate({ to: "/" });
    },
    onError: (error) => {
      // 이메일·비밀번호가 틀린 경우(401)는 로그인 화면의 버튼 아래에 안내해요.
      if (isHTTPError(error) && error.response.status === 401) return;

      alert("로그인에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
