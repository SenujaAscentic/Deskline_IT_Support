// src/app/features/requests/pages/RequestDetailPage.tsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import { requests } from "../data";
import { RequestDetail } from "../components/RequestDetail";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";

export function RequestDetailPage() {
  const { id } = useParams();
  const fixtureMatch = requests.find((r) => r.id === id);

  // Local-only state until Day 5's real PATCH exists — a reload resets this.
  const [request, setRequest] = useState(fixtureMatch);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!request) {
    return <p>Request not found.</p>;
  }

  function handleConfirmCancel() {
    setRequest((r) => (r ? { ...r, status: "cancelled" } : r));
    setConfirmOpen(false);
  }

  return (
    <section>
      <h2>Request Detail</h2>
      <RequestDetail request={request} />

      {/* Requester-only, open-only — role enforcement is Day 6; status check is the real MVP gate for now */}
      {request.status === "open" && (
        <button onClick={() => setConfirmOpen(true)}>Cancel request</button>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Cancel this request?"
        description="This can't be undone — the request will be marked as cancelled."
        confirmLabel="Yes, cancel it"
        cancelLabel="Keep it open"
        onConfirm={handleConfirmCancel}
        onCancel={() => setConfirmOpen(false)}
      />
    </section>
  );
}