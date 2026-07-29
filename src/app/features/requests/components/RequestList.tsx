import { Link } from "react-router-dom";
import { Badge } from "../../../shared/Badge";
import type { Request } from "../types";

type Props = {
  requests: Request[];
};

export function RequestList({ requests }: Props) {
  return (
    <ul className="request-list">
      {requests.map((r) => (
        <li key={r.id} className="request-row">
          <Link to={`/requests/${r.id}`} className="request-titile">
          {r.title}
          </Link>
          

          <div className="request-badges">
            <Badge variant={{ kind: "status", value: r.status }}>{r.status}</Badge>
            <Badge variant={{ kind: "priority", value: r.priority }}>{r.priority}</Badge>
            <Badge variant={{ kind: "category", value: r.category }}>{r.category}</Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}