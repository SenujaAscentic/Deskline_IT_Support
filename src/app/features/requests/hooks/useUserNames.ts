
import { useMemo } from "react";
import { useUsersQuery } from "./useUsersQuery";
import { useSession } from "../../auth/useSession";

export function useUserNames() {
  const session = useSession();
  const { data: users } = useUsersQuery();

  return useMemo(() => {
    const map = new Map<string, string>();
    if (session) map.set(session.userId, `${session.name} (you)`);
    users?.forEach((u) => {
      if (!map.has(u.id)) map.set(u.id, u.name);
    });
    return map;
  }, [users, session]);
}