// src/app/features/requests/pages/RequestDetailPage.tsx
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { requests } from "../data";
import { RequestDetail } from "../components/RequestDetail";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";

export function RequestDetailPage() {
  const { id } = useParams();
  const fixtureMatch = requests.find((r) => r.id === id);

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
      <Link to="/my-requests" className="back-link">
        ← Back to My Requests
      </Link>

      <div className="page-header">
        <h3>Request detail</h3>
      </div>

      <RequestDetail request={request} />

      {request.status === "open" && (
        <div className="request-actions">
          <button className="btn btn--danger" onClick={() => setConfirmOpen(true)}>
            Cancel request
          </button>
        </div>
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