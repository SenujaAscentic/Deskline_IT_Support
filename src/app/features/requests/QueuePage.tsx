// src/app/features/requests/QueuePage.tsx
import { requests } from "./data";
import { useQueueFilters } from "./useQueueFilters";
import { RequestFilters } from "./RequestFilters";
import { AssigneeFilter } from "./AssigneeFilter";
import { RequestList } from "./RequestList";

// TODO Day 6: replace with the real authenticated user from auth state.
const CURRENT_USER_ID_STUB = "u2";

export function QueuePage() {
  const {
    status, priority, category, search, assignee,
    setStatus, setPriority, setCategory, setSearch, setAssignee,
    visibleRequests,
  } = useQueueFilters(requests, CURRENT_USER_ID_STUB);

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
      <RequestList requests={visibleRequests} />
    </section>
  );
}