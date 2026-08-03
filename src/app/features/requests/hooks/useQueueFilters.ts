// src/app/features/requests/useQueueFilters.ts
import { useState } from "react";
import type { Request } from "../types";
import { useRequestFilters } from "./useRequestFilters";

export type AssigneeFilter = "all" | "unassigned" | "me";

export function useQueueFilters(requests: Request[], currentUserId: string) {
  const base = useRequestFilters(requests);
  const [assignee, setAssignee] = useState<AssigneeFilter>("all");

  const visibleRequests = base.visibleRequests.filter((r) => {
    if (assignee === "unassigned") return r.assigneeId === null;
    if (assignee === "me") return r.assigneeId === currentUserId;
    return true;
  });

  return {
    ...base,
    assignee,
    setAssignee,
    visibleRequests, // overrides base.visibleRequests with the assignee-filtered version
  };
}