// src/app/features/requests/pages/RequestDetailPage.tsx
import { Link, useParams } from "react-router-dom";
import { useRequestDetailQuery } from "../hooks/useRequestDetailQuery";
import { RequestDetail } from "../components/RequestDetail";
import { LoadingState } from "../../../shared/components/LoadingState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { MessageThread } from "../components/MessageThread";
import { CommentBox } from "../components/CommentBox";
import { useUserNames } from "../hooks/useUserNames";
import { useSession } from "../../auth/useSession";
import { RequestActions } from "../components/RequestActions";

export function RequestDetailPage() {
  const { id } = useParams();
  // const [confirmOpen, setConfirmOpen] = useState(false);
  const session = useSession();
  
  const { data, isLoading, isError, refetch } = useRequestDetailQuery(id);
  const userNames = useUserNames();
  // Hook is called unconditionally, every render — required by React's rules.
  // Falls back to "" until data exists; nothing calls `mutate` before that anyway.
  
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;
  if (!data) return <p>Request not found.</p>;

  const { request , messages } = data;
  const canComment = request.status === "open" || request.status === "pending";



  return (
    <section>
      <Link to="/my-requests" className="back-link">
        ← Back to My Requests
      </Link>

      <div className="page-header">
        <h3>Request detail</h3>
      </div>

      <RequestDetail request={request} userNames={userNames} />

      {session && <RequestActions request={request} session={session} />}
      <div className = "message-section">
        <h4>Activity</h4>
        <MessageThread messages = {messages} userNames ={userNames} />
        <CommentBox requestId={request.id} canComment={canComment} />
      </div>

    
    </section>
  );
}