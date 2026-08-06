import type { Role } from "../../shared/types";


export type Session = { userId: string; name: string; role: Role; token: string };

let currentSession: Session | null = {
  userId: "u1", name: "Amara Silva", role: "requester", token: "dev-token-u1",
};

const listeners = new Set<() => void>();
export function getSession() { return currentSession; }
export function setSession(s: Session | null) { currentSession = s; listeners.forEach(fn => fn()); }
export function subscribe(fn: () => void) { listeners.add(fn); return () => listeners.delete(fn); }