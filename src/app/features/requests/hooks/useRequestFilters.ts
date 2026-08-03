import { useState } from "react";
import type { Request, Status, Priority, Category } from "../types";
import { filterRequests } from "../filterRequests";
import { useSearchParams } from "react-router-dom";

export function useRequestFilters(requests: Request[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = (searchParams.get("status") as Status | "all" | null) ?? "all";

  function setStatus(value: Status | "all"){
    setSearchParams((prev)=>{const next = new URLSearchParams(prev);
        if(value=="all"){
            next.delete("status");
        } else{
            next.set("status",value);
        }
        return next;
    })
  }
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