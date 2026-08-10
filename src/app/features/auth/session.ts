import type { QueryClient } from "@tanstack/react-query";
import type { Role } from "../../shared/types";

export type Session = {
  userId: string;
  name: string;
  role: Role;
  token: string;
};

let currentSession: Session | null = {
  userId: "u1",
  name: "Amara Silva",
  role: "requester",
  token: "dev-token-u1",
};

const listeners = new Set<() => void>();
let queryClientRef: QueryClient | null = null;

export function registerQueryClient(client: QueryClient) {
  queryClientRef = client;
}

export function getSession(): Session | null {
  return currentSession;
}

export function setSession(session: Session | null) {
  currentSession = session;
  listeners.forEach((fn) => fn());
  queryClientRef?.clear();
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}