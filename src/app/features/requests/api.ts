import { requests as fixtureRequests } from "./data";
import type { Request } from "./types";

const SIMULATED_DELAY_MS = 500;

// Day 5 replaces the inside of this function with a real
// `fetch("/requests")` call — callers won't need to change.
export function fetchRequests(): Promise<Request[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fixtureRequests), SIMULATED_DELAY_MS);
  });
}