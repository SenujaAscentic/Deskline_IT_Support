import { requests } from "./data";
import { useRequestFilters } from "./useRequestFilters";
import { RequestFilters } from "./RequestFilters";
import { RequestList } from "./RequestList";

export function MyRequestsPage() {
  const {
    status,
    priority,
    category,
    search,
    setStatus,
    setPriority,
    setCategory,
    setSearch,
    visibleRequests,
  } = useRequestFilters(requests);

  return (
    <section>
      <h2>My Requests</h2>
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
      <RequestList requests={visibleRequests} />
    </section>
  );
}