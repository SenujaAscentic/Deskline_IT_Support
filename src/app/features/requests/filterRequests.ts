import type { Request, Status, Priority, Category } from "./types";

export type RequestFilters = {
  status: Status | "all";
  priority: Priority | "all";
  category: Category | "all";
  search: string;
};

export function filterRequests(requests: Request[], filters: RequestFilters): Request[] {
  return requests.filter((r) => {
    if (filters.status !== "all" && r.status !== filters.status) return false;
    if (filters.priority !== "all" && r.priority !== filters.priority) return false;
    if (filters.category !== "all" && r.category !== filters.category) return false;
    
    if (filters.search.trim() !== "") {
      const matchesTitle = r.title.toLowerCase().includes(filters.search.toLowerCase());
      if (!matchesTitle) return false;
    }
    return true;
  });
}