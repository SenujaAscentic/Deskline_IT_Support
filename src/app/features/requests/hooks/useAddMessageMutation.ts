// src/app/features/requests/hooks/useAddMessageMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../shared/api/client";
import { queryKeys } from "../../../shared/api/queryKeys";

export function useAddMessageMutation(requestId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) =>
      apiFetch(`/requests/${requestId}/messages`, { method: "POST", body: { body } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.detail(requestId) });
    },
  });
}