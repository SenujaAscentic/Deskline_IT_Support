// src/components/Badge.tsx
import type { Status, Priority, Category } from "../types";

type BadgeVariant =
  | { kind: "status"; value: Status }
  | { kind: "priority"; value: Priority }
  | { kind: "category"; value: Category };

const statusClass: Record<Status, string> = {
  open: "badge--status-open",
  pending: "badge--status-pending",
  closed: "badge--status-closed",
  cancelled: "badge--status-cancelled",
};

const priorityClass: Record<Priority, string> = {
  low: "badge--priority-low",
  medium: "badge--priority-medium",
  high: "badge--priority-high",
};

const categoryClass: Record<Category, string> = {
  hardware: "badge--category-hardware",
  software: "badge--category-software",
  facilities: "badge--category-facilities",
  access: "badge--category-access",
};

function resolveClass(variant: BadgeVariant): string {
  switch (variant.kind) {
    case "status":
      return statusClass[variant.value];
    case "priority":
      return priorityClass[variant.value];
    case "category":
      return categoryClass[variant.value];
  }
}

type BadgeProps = {
  children: React.ReactNode;
  variant: BadgeVariant;
};

export function Badge({ children, variant }: BadgeProps) {
  return <span className={`badge ${resolveClass(variant)}`}>{children}</span>;
}