import { requests } from "./data";
import { RequestDetail } from "./RequestDetail";

export function RequestDetailPage() {
  // Day 1/2 stand-in: hardcoded to the first request.
  // Day 3 replaces this with useParams() to read the :id from the URL.
  const selectedRequest = requests[0];

  return (
    <section>
      <h2>Request Detail</h2>
      <RequestDetail request={selectedRequest} />
    </section>
  );
}