import type { Request } from "../types";
import { RequestRow } from "./RequestRow";

type Props = {
  requests: Request[];
};

export function RequestList({ requests }: Props) {
  return (
    <ul className="request-list">
      {requests.map((r) => (
        <li key={r.id}>
          <RequestRow request={r} />
        </li>
      ))}
    </ul>
  );
}