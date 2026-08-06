// src/app/features/auth/DevRoleSwitcher.tsx
// TEMPORARY — Day 6 replaces this with a real login form + protected routes.
// Exists so role-based API filtering and 403s can be tested before real auth exists.
import { setSession } from "./session";
import { useSession } from "./useSession";

const DEV_USERS = [
  { userId: "u1", name: "Amara Silva", role: "requester" as const },
  { userId: "u2", name: "Devin Perera", role: "technician" as const },
  { userId: "u3", name: "Nadia Fernando", role: "admin" as const },
];

export function DevRoleSwitcher() {
  const session = useSession();

  function loginAs(user: (typeof DEV_USERS)[number]) {
    setSession({ ...user, token: `dev-token-${user.userId}` });
  }

  return (
    <div className="dev-role-switcher">
      <span>Viewing as:</span>
      {DEV_USERS.map((u) => (
        <button
          key={u.userId}
          className={`btn dev-role-switcher__btn ${session?.userId === u.userId ? "is-active" : ""}`}
          onClick={() => loginAs(u)}
        >
          {u.role}
        </button>
      ))}
    </div>
  );
}