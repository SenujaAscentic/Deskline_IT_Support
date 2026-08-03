// src/features/requests/RequestDetail.tsx
import { Badge } from "./Badge";
import type { Request } from "../types";

type Props = {
  request: Request;
};

export function RequestDetail({ request }: Props) {
  return (
    <div className="request-detail">
      <h3>{request.title}</h3>

      <div className="request-badges">
        <Badge variant={{ kind: "status", value: request.status }}>{request.status}</Badge>
        <Badge variant={{ kind: "priority", value: request.priority }}>{request.priority}</Badge>
        <Badge variant={{ kind: "category", value: request.category }}>{request.category}</Badge>
      </div>
    </div>
  );
}