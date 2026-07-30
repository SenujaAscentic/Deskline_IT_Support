import { useCallback, useEffect, useState } from "react";
import type { Request } from "../types";
import { fetchRequests } from "../api";

type RequestsState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; data: Request[] };

export function useRequestsData() {
  const [state, setState] = useState<RequestsState>({ status: "loading" });

  const load = useCallback(() => {
    
    fetchRequests()
      .then((data) => setState({ status: "success", data }))
      .catch(() => setState({ status: "error" }));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const retry = useCallback(()=>{
    setState({ status:"loading"});
    load();
  },[load]);

  return { state, retry};
}