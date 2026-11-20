import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFavorite } from "../api/favorites/create-favorite";

export function useCreateFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      alert("즐겨찾기에 성공했어요.");
    },
    onError: async () => {
      alert("즐겨찾기에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
