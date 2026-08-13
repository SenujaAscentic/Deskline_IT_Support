
import type { SortOption } from "../sortRequests";

type Props = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

export function SortControl({ value, onChange }: Props) {
  return (
    <div className="form-field form-field--inline">
      <label htmlFor="sort-control">Sort by</label>
      <select id="sort-control" value={value} onChange={(e) => onChange(e.target.value as SortOption)}>
        <option value="updatedAt-desc">Recently updated</option>
        <option value="updatedAt-asc">Oldest updated</option>
        <option value="priority-desc">Priority: high to low</option>
        <option value="priority-asc">Priority: low to high</option>
      </select>
    </div>
  );
}