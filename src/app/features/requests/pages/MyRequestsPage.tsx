
import { useRequestFilters } from "../hooks/useRequestFilters";
import { RequestFilters } from "../components/RequestFilters";
import { RequestList } from "../components/RequestList";
import { LoadingState } from "../../../shared/components/LoadingState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { EmptyState } from "../../../shared/components/EmptyState";
import { NoMatchesState } from "../../../shared/components/NoMatchesState";
import { Link } from "react-router-dom";
import { useRequestsQuery } from "../hooks/useRequestsQuery";
import {useSession} from "../../auth/useSession";

export function MyRequestsPage() {

  const session = useSession();
  const { data , isLoading , isError , refetch}= useRequestsQuery(session?.userId);
  const requests = data ?? [];
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

  if(isLoading) return <LoadingState/>
  if(isError) return <ErrorState onRetry={refetch}/>

  return (
    <section>
      <div className="page-header">
        <h2>My Requests</h2>
        <Link to="/requests/new" className="btn btn--primary">
          + New request
        </Link>
      </div>
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
      
    </section>
  );
}