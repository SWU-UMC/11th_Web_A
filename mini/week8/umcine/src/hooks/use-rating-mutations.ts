import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Rating } from "../api/ratings/models";
import { createRating } from "../api/ratings/create-rating";
import { deleteRating } from "../api/ratings/delete-rating";
import { updateRating } from "../api/ratings/update-rating";
import { useMeQuery } from "./use-me-query";
import { myRatingsQueryKey } from "./use-my-ratings-query";

interface SaveRatingVariables {
  // 이미 남긴 평점이 있으면 수정(PATCH), 없으면 등록(POST)해요.
  ratingId?: number;
  movieId: number;
  score: number;
  comment: string | null;
}

export function useSaveRatingMutation() {
  const queryClient = useQueryClient();
  const memberId = useMeQuery().data?.memberId;

  return useMutation({
    mutationFn: ({ ratingId, movieId, score, comment }: SaveRatingVariables) =>
      ratingId === undefined
        ? createRating({ movieId, score, comment })
        : updateRating(ratingId, { score, comment }),
    onSuccess: (savedRating) => {
      // 응답에 저장된 평점이 담겨 있으므로 목록을 다시 조회하지 않고 캐시를 바로 바꿔요.
      queryClient.setQueryData<Rating[]>(myRatingsQueryKey(memberId), (ratings = []) => {
        const hasRating = ratings.some(
          (rating) => rating.ratingId === savedRating.ratingId,
        );

        return hasRating
          ? ratings.map((rating) =>
              rating.ratingId === savedRating.ratingId ? savedRating : rating,
            )
          : [savedRating, ...ratings];
      });
    },
  });
}

export function useDeleteRatingMutation() {
  const queryClient = useQueryClient();
  const memberId = useMeQuery().data?.memberId;

  return useMutation({
    mutationFn: (ratingId: number) => deleteRating(ratingId),
    onSuccess: (_, ratingId) => {
      // 삭제 응답의 result는 null이므로, 요청에 보낸 평점 ID로 캐시에서 제거해요.
      queryClient.setQueryData<Rating[]>(myRatingsQueryKey(memberId), (ratings = []) =>
        ratings.filter((rating) => rating.ratingId !== ratingId),
      );
    },
  });
}
