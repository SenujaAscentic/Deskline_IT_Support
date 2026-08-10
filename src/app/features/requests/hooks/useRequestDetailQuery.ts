// src/app/features/requests/hooks/useRequestDetailQuery.ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../shared/api/client";
import { queryKeys } from "../../../shared/api/queryKeys";
import type { ApiRequestDetail } from "../../../shared/api/types";
import { toUiRequestDetail } from "../../../shared/api/mappers";

export function useRequestDetailQuery(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.requests.detail(id ?? ""),
    queryFn: async () => {
      const data = await apiFetch<ApiRequestDetail>(`/requests/${id}`);
      return toUiRequestDetail(data);
    },
    enabled: Boolean(id),
  });
}