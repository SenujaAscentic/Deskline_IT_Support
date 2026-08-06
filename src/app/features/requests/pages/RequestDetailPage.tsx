// src/app/features/requests/pages/RequestDetailPage.tsx
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRequestDetailQuery } from "../hooks/useRequestDetailQuery";
import { useUpdateRequestMutation } from "../hooks/useUpdateRequestMutation";
import { RequestDetail } from "../components/RequestDetail";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { LoadingState } from "../../../shared/components/LoadingState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { MessageThread } from "../components/MessageThread";
import { CommentBox } from "../components/CommentBox";
import { useUserNames } from "../hooks/useUserNames";

export function RequestDetailPage() {
  const { id } = useParams();
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  const { data, isLoading, isError, refetch } = useRequestDetailQuery(id);
  const userNames = useUserNames();
  // Hook is called unconditionally, every render — required by React's rules.
  // Falls back to "" until data exists; nothing calls `mutate` before that anyway.
  const { mutate: updateRequest } = useUpdateRequestMutation(data?.request.id ?? "");

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;
  if (!data) return <p>Request not found.</p>;

  const { request , messages } = data;
  const canComment = request.status === "open" || request.status === "pending";

  function handleConfirmCancel() {
    updateRequest(
      { status: "cancelled" },
      { onSuccess: () => setConfirmOpen(false) }
    );
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
      <div className = "message-section">
        <h4>Activity</h4>
        <MessageThread messages = {messages} userNames ={userNames} />
        <CommentBox requestId={request.id} canComment={canComment} />
      </div>

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