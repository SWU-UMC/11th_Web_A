import { useQuery } from "@tanstack/react-query";
import { getMemberRatings } from "../api/ratings/get-member-ratings";
import { useMeQuery } from "./use-me-query";

export function myRatingsQueryKey(memberId: number | undefined) {
  return ["ratings", "member", memberId] as const;
}

// 내 평점 목록을 조회해요. 회원 ID는 내 정보 조회(GET /members/me) 응답에서 가져와요.
export function useMyRatingsQuery() {
  const meQuery = useMeQuery();
  const memberId = meQuery.data?.memberId;

  return useQuery({
    queryKey: myRatingsQueryKey(memberId),
    queryFn: () => getMemberRatings(memberId!),
    // 내 정보를 받아 회원 ID를 알게 된 뒤에만 요청해요.
    enabled: memberId !== undefined,
  });
}
