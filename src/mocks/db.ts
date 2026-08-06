// src/mocks/db.ts
import type { Role } from "../app/shared/types";
import type { Status, Priority, Category } from "../app/features/requests/types";

export type DbUser = {
  id: string;
  name: string;
  email: string;
  password: string; // mock-only — never returned in any API response
  role: Role;
};

export type DbMessage = {
  id: string;
  requestId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type DbRequest = {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  category: Category;
  requesterId: string;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
};

// ---- The 3 real, logged-in-able seed users ----
export const seedUsers: DbUser[] = [
  { id: "u1", name: "Amara Silva", email: "amara@corp.test", password: "password", role: "requester" },
  { id: "u2", name: "Devin Perera", email: "devin@corp.test", password: "password", role: "technician" },
  { id: "u3", name: "Nadia Fernando", email: "nadia@corp.test", password: "password", role: "admin" },
];

// ---- Synthetic requesters — fill out the Queue realistically; not real logins ----
const syntheticNames = [
  "Kavi Jayasuriya", "Ishara Gomez", "Ruwan Dias", "Tharushi Kumar", "Nimal Bandara",
  "Sanduni Weera", "Chamod Fonseka", "Dilani Rathnayake", "Yohan Silva", "Piumi Rajapaksha",
  "Ashen Costa", "Manisha Peris", "Lahiru Wickrama", "Anushka De Zoysa", "Sachini Herath",
];

const syntheticRequesters: DbUser[] = syntheticNames.map((name, i) => ({
  id: `req-${i + 2}`,
  name,
  email: `${name.toLowerCase().replace(/ /g, ".")}@corp.test`,
  password: "n/a",
  role: "requester",
}));

export const users: DbUser[] = [...seedUsers, ...syntheticRequesters];

const staff = users.filter((u) => u.role === "technician" || u.role === "admin");
const requesterPool = users.filter((u) => u.role === "requester" && u.id !== "u1"); // exclude the real requester login, so My Requests is small and realistic

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateWithinLastDays(days: number): string {
  const past = Date.now() - Math.random() * days * 24 * 60 * 60 * 1000;
  return new Date(past).toISOString();
}

const statuses: Status[] = ["open", "pending", "closed", "cancelled"];
const priorities: Priority[] = ["low", "medium", "high"];
const categories: Category[] = ["hardware", "software", "facilities", "access"];

const titlesByCategory: Record<Category, string[]> = {
  hardware: ["Laptop battery not charging", "Monitor flickering", "Keyboard keys sticking", "Docking station not detected"],
  software: ["VPN drops on Wi-Fi", "Excel crashes on save", "Need a software license", "Outlook not syncing"],
  facilities: ["Broken AC in meeting room", "Desk chair needs replacing", "Light flickering in hallway", "Leak near kitchen"],
  access: ["Need access to shared drive", "Locked out of HR portal", "Request VPN access", "Need building access card"],
};

function generateRequests(count: number): DbRequest[] {
  const result: DbRequest[] = [];
  for (let i = 0; i < count; i++) {
    const category = pick(categories);
    const status = pick(statuses);
    const createdAt = randomDateWithinLastDays(60);
    // The first 8 belong to the real requester login, so My Requests has a
    // small, realistic list; the rest spread across the synthetic pool so
    // Queue (staff, sees everything) reaches 500+.
    const requester = i < 8 ? seedUsers[0] : pick(requesterPool);

    result.push({
      id: `r${i + 1}`,
      title: pick(titlesByCategory[category]),
      status,
      priority: pick(priorities),
      category,
      requesterId: requester.id,
      assigneeId: status !== "open" ? pick(staff).id : Math.random() > 0.6 ? pick(staff).id : null,
      createdAt,
      updatedAt: status === "open" ? createdAt : randomDateWithinLastDays(30),
    });
  }
  return result;
}

function generateMessages(reqs: DbRequest[]): DbMessage[] {
  const messages: DbMessage[] = [];
  for (const r of reqs) {
    messages.push({
      id: `${r.id}-m1`,
      requestId: r.id,
      authorId: r.requesterId,
      body: `${r.title} — please help, this is affecting my work.`,
      createdAt: r.createdAt,
    });
    if (r.status === "cancelled" || r.status === "closed") {
      messages.push({
        id: `${r.id}-m2`,
        requestId: r.id,
        authorId: r.status === "closed" ? (r.assigneeId ?? r.requesterId) : r.requesterId,
        body: r.status === "closed" ? "Closed by admin." : "Cancelled by requester.",
        createdAt: r.updatedAt,
      });
    }
  }
  return messages;
}

// ---- The mutable in-memory "database" — handlers read and write these directly ----
export const requestsDb: DbRequest[] = generateRequests(520);
export const messagesDb: DbMessage[] = generateMessages(requestsDb);