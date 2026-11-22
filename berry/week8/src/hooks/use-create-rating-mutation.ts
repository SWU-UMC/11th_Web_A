import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../api/ratings/create-rating";
import type { RatingInfo } from "../api/ratings/rating";

export function useCreateRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRating,
    onSuccess: (response) => {
      queryClient.setQueryData<RatingInfo>(["ratings"], response.result);
      alert("평점 등록에 성공했어요.");
    },
    onError: async () => {
      alert("평점 등록에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
