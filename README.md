# Deskline

An internal IT/facilities request desk. Employees file requests; technicians
and admins work them in a shared queue.

## Running the app

npm install
npm run dev

## Tech stack

- Vite + React + TypeScript

## Decisions

### Day 1
- Started with CSS custom properties (`--color-bg`, `--color-text`, etc.)
  defined in `theme.css`, rather than hardcoding colors per component, so
  theming can be added later without rewriting component styles.
- Chose a feature-folder structure (`features/requests/`, `shared/`) over a
  type-based structure (`components/`, `hooks/`, `types/` as top-level
  folders) because the spec names this structure directly as the Day 3
  target, and because the app's domain genuinely has just two concerns
  (requests, users/auth) that benefit from co-locating their types, data,
  and components together.

### Day 2
- **Badges**: built one generic `Badge` component instead of three separate
  ones (StatusBadge/PriorityBadge/CategoryBadge), using a discriminated
  union (`{ kind, value }`) and a `Record<Status, string>`-style class map
  per kind. This makes an invalid combination (e.g. a category value
  labeled as a status) impossible to construct, and makes forgetting to
  style a newly-added status/priority/category value a TypeScript compile
  error rather than a silent visual bug.
- **Filtering**: filtering logic lives in a standalone pure function
  (`filterRequests.ts`), not inline inside a component, so it can be reused
  by both My Requests and the future Queue screen (Day 3) without
  duplication, and so it's unit-testable in isolation (a stretch goal).
- **Responsive layout**: used CSS container queries (`container-type:
  inline-size` + `@container`) for the request list/row layout instead of
  viewport media queries. The list is a component that may end up inside a
  narrower container later (e.g. a split list/detail layout), so its
  responsiveness should depend on its own available width, not the browser
  window's width.
- **Theme toggle**: persisted via `localStorage`, read once on mount via
  lazy `useState` initialization, and applied via a `data-theme` attribute
  on `<html>` so all CSS custom property overrides cascade automatically
  with no prop-drilling of theme state through the component tree.
- **Composition**: extracted `AppShell` (header, theme toggle, layout) as a
  wrapper that takes `children` as a content slot, and pulled screen-level
  logic out of `App.tsx` into dedicated page components
  (`MyRequestsPage`, `RequestDetailPage`) living in `features/requests/`.
  `App.tsx` is now a pure composition root with no state or markup of its
  own — this is meant to make Day 3's routing addition a matter of wrapping
  these existing pages in `<Route>` elements, not restructuring them.

## Known limitations (expected at this stage)

- No routing yet — all screens render at once, statically composed in
  `App.tsx`. Routing arrives Day 3.
- Filter state is not yet persisted in the URL (Day 3 requirement).
- Data is fixture-only; no API integration yet (Day 5).
- No authentication/roles yet (Day 6).