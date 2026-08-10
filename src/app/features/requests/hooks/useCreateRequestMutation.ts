// src/app/features/requests/hooks/useCreateRequestMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../shared/api/client";
import { queryKeys } from "../../../shared/api/queryKeys";
import type { CreateRequestInput } from "../types";
import { useSession } from "../../auth/useSession";




export function useCreateRequestMutation() {
  const queryClient = useQueryClient();
  const session = useSession();

  return useMutation({
    mutationFn: (input: CreateRequestInput) =>
      apiFetch("/requests", { method: "POST", body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all(session?.userId ?? "anonymous") });
    },
  });
}