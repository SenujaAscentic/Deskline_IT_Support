import { requests } from "./data";

export function RequestList() {
  return (
    <ul>
      {requests.map((r) => (
        <li key={r.id}>
          <strong>{r.title}</strong> — {r.status} / {r.priority} / {r.category}
        </li>
      ))}
    </ul>
  );
}