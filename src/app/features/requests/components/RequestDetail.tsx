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
 

  return (
    
<div className="request-detail">
  <h3>{request.title}</h3>
<div className="request-detail-top">
  <dl className="request-badges-meta">
    <div>
      <dt>Status</dt>
      <dd><Badge variant={{ kind: "status", value: request.status }}>{request.status}</Badge></dd>
    </div>
    <div>
      <dt>Priority</dt>
      <dd><Badge variant={{ kind: "priority", value: request.priority }}>{request.priority}</Badge></dd>
    </div>
    <div>
      <dt>Category</dt>
      <dd><Badge variant={{ kind: "category", value: request.category }}>{request.category}</Badge></dd>
    </div>
  </dl>

  <dl className="request-meta">
    <div><dt>Requester</dt><dd>{requesterName}</dd></div>
    <div><dt>Assignee</dt><dd>{assigneeName ?? "Unassigned"}</dd></div>
  </dl>
  </div>
</div>
  );
}