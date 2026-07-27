import { useState } from "react";
import type { Request, Status, Priority, Category } from "./types";
import { filterRequests } from "./filterRequests";

export function useRequestFilters(requests: Request[]) {
  const [status, setStatus] = useState<Status | "all">("all");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [category, setCategory] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");

  const visibleRequests = filterRequests(requests, { status, priority, category, search });

  return {
    status,
    priority,
    category,
    search,
    setStatus,
    setPriority,
    setCategory,
    setSearch,
    visibleRequests,
  };
}