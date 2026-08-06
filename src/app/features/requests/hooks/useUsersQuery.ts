
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../shared/api/client";
import { queryKeys } from "../../../shared/api/queryKeys";
import type { ApiUser } from "../../../shared/api/types";
import { useSession } from "../../auth/useSession";

export function useUsersQuery() {
  const session = useSession();
  const isStaff = session?.role === "technician" || session?.role === "admin";

  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => apiFetch<ApiUser[]>("/users"),
    enabled: isStaff, // requesters get a 403 from this endpoint — don't even try
  });
}