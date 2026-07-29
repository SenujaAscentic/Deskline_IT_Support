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

### Day 3

- **Routing**: added `react-router-dom` and wired all five spec-defined
  routes (`/login`, `/my-requests`, `/queue`, `/requests/new`,
  `/requests/:id`) inside a single `BrowserRouter`, with a catch-all `*`
  route redirecting to `/my-requests` for any unmatched path.
- **URL-persisted status filter**: only `status` is synced to the URL (via
  `useSearchParams`), per the spec's specific requirement — priority,
  category, and search stay in local component state, since persisting
  them wasn't asked for and would add URL noise beyond what's needed. The
  filter param is removed entirely from the URL when set back to "all",
  rather than written as `status=all`, to keep shareable URLs clean.
- **Queue reusing My Requests' patterns**: `useQueueFilters` wraps
  `useRequestFilters` rather than duplicating its logic, so Queue's
  assignee filter is applied on top of the same status/priority/category/
  search filtering My Requests already uses. `QueuePage` renders the same
  `RequestFilters` and `RequestList` components as `MyRequestsPage`, adding
  only an `AssigneeFilter` control — this is what "same filter patterns,
  Queue simply adds assignee" means structurally, not just visually.
- **Detail page navigation**: `RequestDetailPage` now reads the `:id` param
  via `useParams()` and looks up the matching request, replacing the Day
  1/2 hardcoded `requests[0]` stand-in. List rows use React Router's
  `Link` (not a plain `<a>`) so navigation doesn't trigger a full page
  reload.
- **Folder structure**: split `features/requests/` into `hooks/`,
  `components/`, and `pages/` subfolders now that it held 13 files across
  four distinct kinds of file. `types.ts`, `data.ts`, and
  `filterRequests.ts` stay at the feature root since each is a single file
  with no siblings of its own kind yet. `features/auth/` stays flat for
  now (one file) until Day 6 gives it enough files to warrant the same
  split.

### Dependencies

**react-router-dom** — used for all client-side routing (the five
spec-defined routes, the `/requests/:id` dynamic segment, and the
`?status=` URL-persisted filter via `useSearchParams`).

Considered building routing by hand instead (matching `window.location`
against path patterns, listening to `popstate` for back/forward). Rejected
because:
- The spec requires a dynamic segment (`:id`) and query-param state
  (`status`) — both are solved problems with well-tested edge cases (URL
  encoding, history stack behavior, match precedence) not worth
  re-deriving for a 2-week project.

- Small footprint for what it replaces — one dependency instead of a
  hand-written router, manual `<a>`-click interception, and manual history
  handling.

**Removed during Day 3 cleanup** (installed early but unused):

- **tailwindcss, @tailwindcss/postcss, autoprefixer, postcss** — theming
  is already handled via CSS custom properties (`theme.css`), which
  satisfies the spec's token-based theming requirement without a second,
  competing styling system.
- **class-variance-authority** — badge variant styling is already handled
  by a typed `Record<Status, string>`-style map in `Badge.tsx`, enforced
  exhaustively by TypeScript at compile time; `cva` would duplicate that
  same lookup at runtime with no added safety.
- **clsx** — nothing in the app yet has multiple independent conditional
  classes on one element; will reconsider once a component (likely a form
  input or confirm dialog, Day 4) actually needs it.
- **@tanstack/react-query** — no real API exists yet to fetch from; this
  is a named stretch goal (section 9) to reconsider on Day 5 once the mock
  API is in place and there's an actual server-state case to evaluate it
  against.
- **axios** — same reasoning as above; no API calls exist yet. When Day 5
  arrives, the default will be the browser's built-in `fetch` (zero
  dependencies, sufficient for this REST contract's size), with `axios`
  only added if a specific `fetch` limitation is hit.

## Known limitations (expected at this stage)

- Nav links show all five routes to everyone; role-aware navigation and
  route protection arrive Day 6.
- Queue's "assigned to me" filter uses a hardcoded stub user id
  (`CURRENT_USER_ID_STUB`) until real auth exists (Day 6).
- `/login` and `/requests/new` are placeholder pages; real forms arrive
  Day 6 and Day 4 respectively.
- Data is still fixture-only; no API integration yet (Day 5).