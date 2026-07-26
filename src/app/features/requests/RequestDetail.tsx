// src/features/requests/RequestDetail.tsx
import type { Request } from "./types";

type Props = {
  request: Request;
};

export function RequestDetail({ request }: Props) {
  return (
    <div className="request-detail">
      <h3>{request.title}</h3>
      <p>Status: {request.status}</p>
      <p>Priority: {request.priority}</p>
      <p>Category: {request.category}</p>
    </div>
  );
}