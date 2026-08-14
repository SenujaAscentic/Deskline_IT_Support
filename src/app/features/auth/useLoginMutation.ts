// src/app/features/auth/useLoginMutation.ts
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../../shared/api/client";
import { setSession } from "./session";
import type { Role } from "../../shared/types";

type LoginResponse = {
  user: { id: string; name: string; email: string; role: Role };
  token: string;
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      apiFetch<LoginResponse>("/login", { method: "POST", body: input }),
    onSuccess: (data) => {
      setSession({
        userId: data.user.id,
        name: data.user.name,
        role: data.user.role,
        token: data.token,
      });
    },
  });
}