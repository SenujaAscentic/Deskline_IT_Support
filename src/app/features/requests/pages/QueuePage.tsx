
// import { useRequestsData } from "../hooks/useRequestsData";
import { useQueueFilters } from "../hooks/useQueueFilters";
import { RequestFilters } from "../components/RequestFilters";
import { AssigneeFilter } from "../components/AssigneeFilter";
import { RequestList } from "../components/RequestList";
import { LoadingState } from "../../../shared/components/LoadingState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { EmptyState } from "../../../shared/components/EmptyState";
import { NoMatchesState } from "../../../shared/components/NoMatchesState";
import { useSession } from "../../auth/useSession";
import { useRequestsQuery } from "../hooks/useRequestsQuery";

// TODO Day 6: replace with the real authenticated user from auth state.


export function QueuePage() {
  const session = useSession();
  const {data , isLoading , isError , refetch}= useRequestsQuery(session?.userId);
 
  const requests = data ?? [];

  const {
    status, priority, category, search, assignee,
    setStatus, setPriority, setCategory, setSearch, setAssignee,
    visibleRequests,
  } = useQueueFilters(requests, session?.userId ?? "");

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <section>
      <h2>Queue</h2>
      <RequestFilters
        status={status}
        priority={priority}
        category={category}
        search={search}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onCategoryChange={setCategory}
        onSearchChange={setSearch}
      />
      <AssigneeFilter value={assignee} onChange={setAssignee} />
      {requests.length === 0 ? (
        <EmptyState message="The queue is empty." />
      ) : visibleRequests.length === 0 ? (
        <NoMatchesState />
      ) : (
        <RequestList requests={visibleRequests} />
      )}
    </section>
  );
}