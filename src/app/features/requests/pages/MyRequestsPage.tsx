
import { useRequestFilters } from "../hooks/useRequestFilters";
import { RequestFilters } from "../components/RequestFilters";
import { RequestList } from "../components/RequestList";
import { useRequestsData } from "../hooks/useRequestsData";
import { LoadingState } from "../../../shared/components/LoadingState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { EmptyState } from "../../../shared/components/EmptyState";
import { NoMatchesState } from "../../../shared/components/NoMatchesState";

export function MyRequestsPage() {

  const {state,retry}= useRequestsData();
  const requests = state.status=== "success" ? state.data: [];
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

  if(state.status === "loading") return <LoadingState/>
  if(state.status === "error") return <ErrorState onRetry={retry}/>

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
      {requests.length === 0 ? (
        <EmptyState message="You have no requests yet"/>

      ): visibleRequests.length === 0 ? (
        <NoMatchesState/>
      ):<RequestList requests={visibleRequests}/>
      }
      <RequestList requests={visibleRequests} />
    </section>
  );
}