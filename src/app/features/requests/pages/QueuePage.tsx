// src/app/features/requests/pages/QueuePage.tsx
import { useRequestsData } from "../hooks/useRequestsData";
import { useQueueFilters } from "../hooks/useQueueFilters";
import { RequestFilters } from "../components/RequestFilters";
import { AssigneeFilter } from "../components/AssigneeFilter";
import { RequestList } from "../components/RequestList";
import { LoadingState } from "../../../shared/components/LoadingState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { EmptyState } from "../../../shared/components/EmptyState";
import { NoMatchesState } from "../../../shared/components/NoMatchesState";

// TODO Day 6: replace with the real authenticated user from auth state.
const CURRENT_USER_ID_STUB = "u2";

export function QueuePage() {
  const { state, retry } = useRequestsData();
  const requests = state.status === "success" ? state.data : [];

  const {
    status, priority, category, search, assignee,
    setStatus, setPriority, setCategory, setSearch, setAssignee,
    visibleRequests,
  } = useQueueFilters(requests, CURRENT_USER_ID_STUB);

  if (state.status === "loading") return <LoadingState />;
  if (state.status === "error") return <ErrorState onRetry={retry} />;

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