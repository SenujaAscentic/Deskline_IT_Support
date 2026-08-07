// src/app/features/requests/hooks/useStaffList.ts
import { useMemo } from "react";
import { useUsersQuery } from "./useUsersQuery";

export function useStaffList() {
  const { data: users } = useUsersQuery();
  return useMemo(
    () => (users ?? []).filter((u) => u.role === "technician" || u.role === "admin"),
    [users]
  );
}