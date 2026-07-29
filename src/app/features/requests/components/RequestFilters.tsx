import type { Status, Priority, Category } from "../types";

type Props = {
  status: Status | "all";
  priority: Priority | "all";
  category: Category | "all";
  search: string;
  onStatusChange: (value: Status | "all") => void;
  onPriorityChange: (value: Priority | "all") => void;
  onCategoryChange: (value: Category | "all") => void;
  onSearchChange: (value: string) => void;
};

export function RequestFilters({
  status,
  priority,
  category,
  search,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  onSearchChange,
}: Props) {
  return (
    <div className="filters-bar">
      <select value={status} onChange={(e) => onStatusChange(e.target.value as Status | "all")}>
        <option value="all">All statuses</option>
        <option value="open">Open</option>
        <option value="pending">Pending</option>
        <option value="closed">Closed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <select value={priority} onChange={(e) => onPriorityChange(e.target.value as Priority | "all")}>
        <option value="all">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select value={category} onChange={(e) => onCategoryChange(e.target.value as Category | "all")}>
        <option value="all">All categories</option>
        <option value="hardware">Hardware</option>
        <option value="software">Software</option>
        <option value="facilities">Facilities</option>
        <option value="access">Access</option>
      </select>

      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}