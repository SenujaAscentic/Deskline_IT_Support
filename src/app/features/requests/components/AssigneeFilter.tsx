// src/app/features/requests/AssigneeFilter.tsx
import type { AssigneeFilter as AssigneeFilterValue } from "../hooks/useQueueFilters";

type Props = {
  value: AssigneeFilterValue;
  onChange: (value: AssigneeFilterValue) => void;
};

export function AssigneeFilter({ value, onChange }: Props) {
  return (
    <label htmlFor="assignee-filter">Assignee
      <select id="assignee-filter" value={value} onChange={(e) => onChange(e.target.value as AssigneeFilterValue)}>
        <option value="all">All assignees</option>
        <option value="unassigned">Unassigned</option>
        <option value="me">Assigned to me</option>
      </select>
    </label>
  );
}