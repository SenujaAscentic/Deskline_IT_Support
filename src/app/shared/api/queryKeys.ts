// src/app/shared/api/queryKeys.ts
export const queryKeys = {
  requests: {
    all: (userId: string) => ["requests", userId] as const,
    detail: (id: string) => ["requests", "detail", id] as const,
  },
  users: ["users"] as const,
};