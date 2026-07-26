import type { Request, Message } from "./types";
import type { User } from "../../shared/types";

export const users: User[] = [
  { id: "u1", name: "Amara Silva", email: "amara@corp.test", role: "requester" },
  { id: "u2", name: "Devin Perera", email: "devin@corp.test", role: "technician" },
  { id: "u3", name: "Nadia Fernando", email: "nadia@corp.test", role: "admin" },
];

export const requests: Request[] = [
  {
    id: "r1",
    title: "VPN drops on Wi-Fi",
    status: "open",
    priority: "high",
    category: "software",
    requesterId: "u1",
    assigneeId: null,
    createdAt: "2026-07-20T09:00:00Z",
    updatedAt: "2026-07-20T09:00:00Z",
  },
  
];

export const messages: Message[] = [
  {
    id: "m1",
    requestId: "r1",
    authorId: "u1",
    body: "VPN keeps disconnecting every few minutes on the office Wi-Fi.",
    createdAt: "2026-07-20T09:00:00Z",
  },
];