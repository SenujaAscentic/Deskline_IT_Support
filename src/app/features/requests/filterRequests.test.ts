
import { describe, it, expect } from "vitest";
import { filterRequests } from "./filterRequests";
import type { Request } from "./types";

const baseRequest: Request = {
  id: "r1",
  title: "VPN drops on Wi-Fi",
  status: "open",
  priority: "high",
  category: "software",
  requesterId: "u1",
  assigneeId: null,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

const requests: Request[] = [
  baseRequest,
  { ...baseRequest, id: "r2", title: "Broken AC", status: "pending", priority: "low", category: "facilities" },
  { ...baseRequest, id: "r3", title: "Need access card", status: "closed", priority: "medium", category: "access" },
];

describe("filterRequests", () => {
  it("returns all requests when every filter is 'all' and search is empty", () => {
    const result = filterRequests(requests, { status: "all", priority: "all", category: "all", search: "" });
    expect(result).toHaveLength(3);
  });

  it("filters by status", () => {
    const result = filterRequests(requests, { status: "open", priority: "all", category: "all", search: "" });
    expect(result).toEqual([baseRequest]);
  });

  it("combines multiple filters with AND logic", () => {
    const result = filterRequests(requests, { status: "pending", priority: "low", category: "all", search: "" });
    expect(result.map((r) => r.id)).toEqual(["r2"]);
  });

  it("search is case-insensitive substring match on title", () => {
    const result = filterRequests(requests, { status: "all", priority: "all", category: "all", search: "vpn" });
    expect(result.map((r) => r.id)).toEqual(["r1"]);
  });

  it("returns an empty array when nothing matches", () => {
    const result = filterRequests(requests, { status: "cancelled", priority: "all", category: "all", search: "" });
    expect(result).toEqual([]);
  });
});