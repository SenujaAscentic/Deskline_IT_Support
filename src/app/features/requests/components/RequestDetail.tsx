// src/app/features/requests/components/RequestDetail.tsx
import { Badge } from "./Badge";
import type { Request } from "../types";

type Props = {
  request: Request;
  //userNames: Map<string, string>;
  requesterName: string;
  assigneeName: string| null;
};

export function RequestDetail({ request, requesterName, assigneeName }: Props) {
  //const requesterName = userNames.get(request.requesterId) ?? request.requesterId;
  //const assigneeName = request.assigneeId
    // ? (userNames.get(request.assigneeId) ?? request.assigneeId)
    // : "Unassigned";

  return (
    <div className="request-detail">
      <h3>{request.title}</h3>

      <div className="request-badges">
        <Badge variant={{ kind: "status", value: request.status }}>{request.status}</Badge>
        <Badge variant={{ kind: "priority", value: request.priority }}>{request.priority}</Badge>
        <Badge variant={{ kind: "category", value: request.category }}>{request.category}</Badge>
      </div>

      <dl className="request-meta">
        <div>
          <dt>Requester</dt>
          <dd>{requesterName}</dd>
        </div>
        <div>
          <dt>Assignee</dt>
          <dd>{assigneeName ?? "Unassigned"}</dd>
        </div>
      </dl>
    </div>
  );
}