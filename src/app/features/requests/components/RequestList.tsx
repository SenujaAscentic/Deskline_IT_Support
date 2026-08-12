import type { Request } from "../types";
import { RequestRow } from "./RequestRow";

type Props = {
  requests: Request[];
};

export function RequestList({ requests }: Props) {
  return (
<div>
    
  <div className="request-list-legend">
    <span className="legend-item"><span className="legend-dot legend-dot--status" /> Status</span>
    <span className="legend-item"><span className="legend-dot legend-dot--priority" /> Priority</span>
    <span className="legend-item"><span className="legend-dot legend-dot--category" /> Category</span>
  </div>

    <ul className="request-list">
      {requests.map((r) => (
        <li key={r.id}>
          <RequestRow request={r} />
        </li>
      ))}
    </ul>
</div>
    
  );
}