// src/app/features/requests/hooks/useRequestsQuery.ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../shared/api/client";
import { queryKeys } from "../../../shared/api/queryKeys";
import type { ApiRequestListItem } from "../../../shared/api/types";
import { toUiRequest } from "../../../shared/api/mappers";

export function useRequestsQuery(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.requests.all(userId ?? "anonymous"),
    queryFn: async () => {
      const data = await apiFetch<ApiRequestListItem[]>("/requests");
      return data.map(toUiRequest);
    },
    enabled: Boolean(userId),
  });
}