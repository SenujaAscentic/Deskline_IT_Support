// src/app/features/requests/pages/RequestDetailPage.tsx
import { Link, useParams } from "react-router-dom";
import { useRequestDetailQuery } from "../hooks/useRequestDetailQuery";
import { useUserNames } from "../hooks/useUserNames";
import { useSession } from "../../auth/useSession";
import { RequestDetail } from "../components/RequestDetail";
import { RequestActions } from "../components/RequestActions";
import { MessageThread } from "../components/MessageThread";
import { CommentBox } from "../components/CommentBox";
import { LoadingState } from "../../../shared/components/LoadingState";
import { ErrorState } from "../../../shared/components/ErrorState";

export function RequestDetailPage() {
  const { id } = useParams();
  const session = useSession();
  const { data, isLoading, isError, refetch } = useRequestDetailQuery(id);
  const userNames = useUserNames();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;
  if (!data) return <p>Request not found.</p>;

  const { request, messages , requesterName, assigneeName } = data;
  const canComment = request.status === "open" || request.status === "pending";

  return (
    <section>
      <Link to="/my-requests" className="back-link">
        ← Back to My Requests
      </Link>

      <div className="page-header">
        <h3>Request detail</h3>
      </div>
      <div className="request-detail-card">
      <RequestDetail request={request} requesterName={requesterName} assigneeName={assigneeName} />

      {session && <RequestActions request={request} session={session} />}
      </div>
      

      <div className="message-section">
        <h4>Activity</h4>
        <MessageThread messages={messages} userNames={userNames} />
        <CommentBox requestId={request.id} canComment={canComment} />
      </div>
    </section>
  );
}