import { Link } from "react-router-dom";
import { Badge } from "./Badge";
import type { Request } from "../types";

type Props = {
  request: Request;
};

export function RequestRow({ request: r }: Props) {
  return (
    <div className="request-row">
      <Link to={`/requests/${r.id}`} className="request-title">
        {r.title}
      </Link>
      <div className="request-badges">
        <Badge variant={{ kind: "status", value: r.status }}>{r.status}</Badge>
        <Badge variant={{ kind: "priority", value: r.priority }}>{r.priority}</Badge>
        <Badge variant={{ kind: "category", value: r.category }}>{r.category}</Badge>
      </div>
    </div>
  );
}