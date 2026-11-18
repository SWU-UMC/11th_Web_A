import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { getMemberRatings } from "../api/members";
import { createRating } from "../api/ratings/create-rating";
import { deleteRating } from "../api/ratings/delete-rating";
import { updateRating } from "../api/ratings/update-rating";
import { useAuthStore } from "../stores/auth-store";
import { getMemberIdFromToken } from "../utils/auth/get-member-id-from-token";

interface RatingPanelProps {
  movieId: number;
}

export function RatingPanel({
  movieId,
}: RatingPanelProps) {
  const queryClient = useQueryClient();

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const memberId =
    getMemberIdFromToken(accessToken);

  const [draft, setDraft] = useState<{
    movieId: number;
    score: number;
    comment: string;
    } | null>(null);

  const ratingsQuery = useQuery({
    queryKey: [
      "members",
      memberId,
      "ratings",
    ],
    queryFn: () =>
      getMemberRatings(memberId as number),
    enabled: memberId !== null,
    staleTime: 30 * 1000,
    retry: false,
  });

  const currentRating =
    ratingsQuery.data?.find(
      (rating) => rating.movieId === movieId,
    );

    const currentDraft =
    draft?.movieId === movieId
        ? draft
        : null;

    const selectedScore =
    currentDraft?.score ??
    currentRating?.score ??
    0;

    const comment =
    currentDraft?.comment ??
    currentRating?.comment ??
    "";

  const refreshRatings = () =>
    queryClient.invalidateQueries({
      queryKey: [
        "members",
        memberId,
        "ratings",
      ],
    });

  const createRatingMutation = useMutation({
    mutationFn: createRating,

    onSuccess: async () => {
        setDraft(null);
      await refreshRatings();
      alert("평점을 등록했어요.");
    },

    onError: () => {
      alert("평점 등록에 실패했어요.");
    },
  });

  const updateRatingMutation = useMutation({
    mutationFn: updateRating,

    onSuccess: async () => {
        setDraft(null);
      await refreshRatings();
      alert("평점을 수정했어요.");
    },

    onError: () => {
      alert("평점 수정에 실패했어요.");
    },
  });

  const deleteRatingMutation = useMutation({
    mutationFn: deleteRating,

    onSuccess: async () => {
        setDraft(null);
      await refreshRatings();
      alert("평점을 삭제했어요.");
    },

    onError: () => {
      alert("평점 삭제에 실패했어요.");
    },
  });

  const isMutating =
    createRatingMutation.isPending ||
    updateRatingMutation.isPending ||
    deleteRatingMutation.isPending;

  const handleSave = () => {
    if (!accessToken || memberId === null) {
      alert("로그인 후 평점을 남길 수 있어요.");
      return;
    }

    if (selectedScore === 0) {
      alert("별점을 선택해 주세요.");
      return;
    }

    if (currentRating) {
      updateRatingMutation.mutate({
        ratingId: currentRating.ratingId,
        body: {
          score: selectedScore,
          comment,
        },
      });

      return;
    }

    createRatingMutation.mutate({
      movieId,
      score: selectedScore,
      comment,
    });
  };

  const handleDelete = () => {
    if (!currentRating) {
      return;
    }

    const shouldDelete = window.confirm(
      "작성한 평점을 삭제할까요?",
    );

    if (!shouldDelete) {
      return;
    }

    deleteRatingMutation.mutate(
      currentRating.ratingId,
    );
  };

  return (
    <aside className="border-l border-gray-200 pl-6">
      <h2 className="text-lg font-bold">
        내 평점
      </h2>

      <p className="mt-2 text-xs text-gray-400">
        별점은 필수, 후기는 선택이에요.
      </p>

      {memberId !== null &&
        ratingsQuery.isPending && (
          <p className="mt-3 text-xs text-gray-400">
            내 평점을 불러오는 중이에요.
          </p>
        )}

      {ratingsQuery.isError && (
        <p className="mt-3 text-xs text-red-600">
          내 평점을 불러오지 못했어요.
        </p>
      )}

      <div
        className="mt-3 flex gap-1"
        aria-label="평점 선택"
      >
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            className="grid size-8 place-items-center rounded-md border border-gray-200 bg-white"
            type="button"
            aria-label={`${score}점`}
            aria-pressed={
              score <= selectedScore
            }
            disabled={isMutating}
            onClick={() =>
                setDraft({
                    movieId,
                    score,
                    comment,
                })
                }
          >
            <span
              className={
                score <= selectedScore
                  ? "text-xl text-yellow-400"
                  : "text-xl text-gray-300"
              }
              aria-hidden="true"
            >
              ★
            </span>
          </button>
        ))}
      </div>

      <textarea
        className="mt-2.5 h-20 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-xs outline-none focus:border-blue-600"
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        aria-label="평점 후기"
        value={comment}
        disabled={isMutating}
        onChange={(event) =>
            setDraft({
                movieId,
                score: selectedScore,
                comment: event.target.value,
            })
            }
      />

      <button
        className="mt-2 w-full rounded-md bg-gray-900 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
        type="button"
        disabled={isMutating}
        onClick={handleSave}
      >
        {isMutating
          ? "처리 중"
          : currentRating
            ? "평점 수정"
            : "평점 저장"}
      </button>

      {currentRating && (
        <button
          className="mt-2 w-full rounded-md border border-red-300 py-2.5 text-sm font-bold text-red-600 disabled:cursor-not-allowed disabled:text-red-300"
          type="button"
          disabled={isMutating}
          onClick={handleDelete}
        >
          평점 삭제
        </button>
      )}
    </aside>
  );
}