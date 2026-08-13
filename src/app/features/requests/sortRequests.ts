// src/app/features/requests/sortRequests.ts
import type { Request } from "./types";

export type SortOption = "updatedAt-desc" | "updatedAt-asc" | "priority-desc" | "priority-asc";

const priorityRank: Record<Request["priority"], number> = {
  low: 0,
  medium: 1,
  high: 2,
};

export function sortRequests(requests: Request[], sort: SortOption): Request[] {
  const sorted = [...requests];

  switch (sort) {
    case "updatedAt-desc":
      return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    case "updatedAt-asc":
      return sorted.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
    case "priority-desc":
      return sorted.sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]);
    case "priority-asc":
      return sorted.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
  }
}