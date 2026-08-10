import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../shared/api/client";
import { queryKeys } from "../../../shared/api/queryKeys";
import { useSession } from "../../auth/useSession";
import type { Status } from "../types";

type UpdateInput = { status?: Status; assigneeId?: string | null };

export function useUpdateRequestMutation(requestId: string) {
  const queryClient = useQueryClient();
  const session = useSession();

  return useMutation({
    mutationFn: (input: UpdateInput) =>
      apiFetch(`/requests/${requestId}`, { method: "PATCH", body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.detail(requestId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all(session?.userId ?? "anonymous") });
    },
  });
}