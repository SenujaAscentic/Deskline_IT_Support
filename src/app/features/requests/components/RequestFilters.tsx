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
  children?: React.ReactNode;
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
  children,
}: Props) {
  return (
    <div className="filters-bar">
      <div className="form-field form-field--inline">
        <label htmlFor="status-filter">Status</label>
        <select id="status-filter" value={status} onChange={(e) => onStatusChange(e.target.value as Status | "all")}>
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="closed">Closed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="form-field form-field--inline">
        <label htmlFor="priority-filter">Priority</label>
        <select id="priority filter" value={priority} onChange={(e) => onPriorityChange(e.target.value as Priority | "all")}>
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="form-field form-field--inline">
        <label htmlFor="category-filter">Category</label>
        <select id="category-filter" value={category} onChange={(e) => onCategoryChange(e.target.value as Category | "all")}>
          <option value="all">All categories</option>
          <option value="hardware">Hardware</option>
          <option value="software">Software</option>
          <option value="facilities">Facilities</option>
          <option value="access">Access</option>
        </select>
      </div>

      <div className="form-field form-field--inline">
        <label htmlFor="title-search">Search by title</label>
        <input
          id="title-search"
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {children}
    </div>
  );
}