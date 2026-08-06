// src/app/shared/api/queryKeys.ts
export const queryKeys = {
  requests: {
    all: ["requests"] as const,
    detail: (id: string) => ["requests", id] as const,
  },
  users: ["users"] as const,
};