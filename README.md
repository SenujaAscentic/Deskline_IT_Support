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

### Day 4

- **Fake async data layer**: added `api.ts` (returns `Promise<Request[]>`)
  and `useRequestsData` to give My Requests/Queue genuine loading and error
  states, per the spec's own "fixtures + fake async" guidance for Days
  1–4. `api.ts` is intentionally shaped like a real fetch call so Day 5
  can replace its internals without changing any caller.
- **Create request form**: inline validation with a `touched` map so
  errors only appear after a field has been interacted with (or on
  submit, which touches every field at once). Submit is disabled while
  invalid or while a simulated submission is in flight, preventing
  double-submit.
- **Confirm-before-cancel**: built one reusable `ConfirmDialog` (not a
  cancel-specific one), since the spec treats Cancel and Close as "the
  same kind of interaction" — Day 6's admin Close action will reuse this
  same component. Its styling lives in `features/requests/requests.css`
  rather than `shared/styles/`, since only the requests feature triggers
  it today; it'll move to shared styling only if a second feature
  genuinely needs a dialog.
- **Reduce motion**: toggle persists via `localStorage`, same pattern as
  the theme toggle. On a fresh visit with no saved choice, it defers to
  the OS `prefers-reduced-motion` setting; once the user explicitly
  toggles it, their in-app choice takes priority. A
  `@media (prefers-reduced-motion: reduce)` rule is kept as a fallback for
  the brief window before React mounts and sets `data-motion` itself.
- **Micro-interactions (3)**: confirm dialog open (fade + scale), badge
  color transition on status change, disabled-button opacity fade during
  form submission — all neutralized instantly when reduce motion is on,
  with no per-component changes needed, since the override is a single
  blanket rule (`[data-motion="reduced"] * { transition: none; animation:
  none }`).
- **Labeled inputs**: every filter control and form field uses a real
  `<label htmlFor>` / `id` pairing, not just placeholder text, so screen
  readers announce each control correctly.
- **CSS restructure**: split the single `theme.css` into layered files
  under `shared/styles/` (`tokens`, `base`, `layout`, `buttons`, `forms`,
  `states`, `motion`), imported in that dependency order — general/token
  files first, feature-specific and motion-override files last. Feature-
  specific styling (badges, request cards, the confirm dialog) lives in
  `features/requests/requests.css` instead, following the same "does this
  belong to one feature or many" test already used for folder structure.
- **Introduced a spacing scale and button/toggle component system**
  (`--space-1`…`--space-6`, `.btn`/`.btn--primary`/`.btn--danger`, a
  custom `ToggleSwitch` using `role="switch"`/`aria-checked`) so
  interactive controls look and behave consistently across screens,
  rather than each button/toggle being styled ad hoc per component.
- **Folder consistency fix**: moved `Badge` from `shared/components/` into
  `features/requests/components/`, alongside its CSS. It's typed directly
  against `Status`/`Priority`/`Category` from the requests feature and is
  only ever consumed by pages within that same feature (My Requests,
  Queue) — being used on two *pages* isn't the same as being used by two
  *features*, so it didn't actually meet the bar for `shared/`. It would
  move back if a second, unrelated feature needed the same colored-pill
  pattern later.

### Dependencies

No new dependencies added this session — `react-hook-form` and `zod` were
considered for the create-request form but not adopted: at 4–5 fields with
simple rules, a hand-written `validate()` function is equally clear with
zero added dependencies, and introducing react-hook-form's uncontrolled-
input model would sit inconsistently next to the plain `useState`
controlled-input pattern used everywhere else in the app (filters, toggles).
`zod` remains a real candidate for Day 5, specifically for validating
API responses at the UI/API type boundary — a different problem than form
validation.

Considered Tailwind CSS again for the styling pass and again did not
adopt it — by this point the app has a working token system, a component
library, and CSS files organized to mirror the component folder structure;
switching frameworks now would mean rewriting already-understood, working
styling rather than extending it, which conflicts with the "no rewrites"
principle and the "you should be able to explain any code" assessment
criterion.

### Day 5

- **Mock API**: replaced all fixture-based data access with MSW handlers
  implementing the full section 7 contract (7 endpoints), backed by an
  in-memory database seeded with 520 generated requests, 18 users (3 real
  seed logins + 15 synthetic requesters), and matching messages. Role-
  based filtering (`GET /requests`) and the full status-lifecycle
  legality table (`PATCH /requests/:id`) are enforced server-side in the
  handlers, not just hidden in the UI — this is the real, working half of
  Day 6's 403 requirement, built ahead of time so Day 6 only needs to add
  UI-level hiding and feedback on top of already-correct enforcement.

- **Auth stub**: since real login is Day 6, a small session module
  (`session.ts` + `useSession`, using `useSyncExternalStore` to keep React
  components in sync with state that lives outside React) simulates a
  logged-in user, with a temporary `DevRoleSwitcher` for testing role-
  based behavior before real login exists. Switching sessions clears the
  entire TanStack Query cache (`queryClient.clear()`, triggered from
  `setSession` itself) — without this, a role that previously had access
  to cached data (e.g. staff fetching `/users`) could still read that
  stale cached data after switching to a role that's supposed to be
  denied it (e.g. a requester), which was caught while testing name
  resolution across roles.

- **TanStack Query**: adopted now that a real API exists to manage state
  against — not earlier, since there was nothing genuine to cache before
  Day 5. Query keys are scoped by user id (e.g. `["requests", userId]`)
  so switching sessions is treated as a genuinely different query rather
  than a stale cache hit on an unrelated user's data; this was a real bug
  caught mid-build (switching roles updated the highlighted button but
  not the visible list, until the key was made session-dependent).

- **UI/API type boundary**: `ApiRequestListItem` vs `ApiRequestDetail`
  deliberately differ — the detail response includes the message thread
  plus server-resolved `requesterName`/`assigneeName`. Resolving ids to
  names happens server-side (in the handler, which has unrestricted
  access to the full user table) rather than client-side, so a requester
  can see their own request's relevant names correctly without needing
  the broader `GET /users` access that's intentionally staff-only.
  `mappers.ts` is the one file that would need to change if a real API's
  response shape ever diverged from these mocks.

- **Message thread**: built from scratch (never existed pre-Day 5) — a
  flat, chronological list per request, matching the spec's "no nested/
  threaded replies" rule. Comment submission is disabled while a mutation
  is in flight (`isPending`), preventing double-submit. The comment box
  is entirely absent (not just disabled) once a request is closed/
  cancelled, per spec. Status changes (cancel/close) generate a real
  system message server-side, naming the actual actor by name (e.g.
  "Cancelled by Amara Silva."), generated as a genuine side effect of the
  real `PATCH` action rather than backfilled fixture data.

- **Role-gated actions**: consolidated into one `RequestActions`
  component rather than scattering conditionals across the page — it
  computes each action's visibility from role + status + ownership
  (matching the spec's action rules table exactly) and reuses one
  `ConfirmDialog` instance for both cancel and close, since the spec
  treats them as "the same kind of interaction."

- **Queue performance (500+ rows)**: adopted `@tanstack/react-virtual`
  (headless — no styled components, so it doesn't conflict with the "no
  full UI kit" rule) rather than hand-rolling windowing logic or using
  pagination. Considered pagination as a simpler alternative — no new
  dependency, and it would have let Queue reuse a single unmodified list
  component — but the spec frames the requirement in terms of scrolling
  ("filtering, searching, and *scrolling* the Queue must stay usable"),
  and pagination interacts awkwardly with combinable filters (unclear
  what "page 3" means once a filter narrows 520 results to 40). Also
  considered combining pagination with virtualization, but virtualization
  already delivers pagination's core benefit (bounded DOM size) without
  its downsides at this scale — combining both would only matter at a
  much larger scale requiring server-side pagination to limit what's
  fetched, not just what's rendered, which isn't the case with a single
  520-row `GET /requests` response.

- **Row markup consistency across My Requests and Queue**: extracted a
  single `RequestRow` component, used by both the plain `RequestList`
  (My Requests) and `VirtualizedRequestList` (Queue), so the two screens'
  row design is structurally guaranteed to stay identical rather than
  kept in sync by discipline across two separately-maintained copies.
  Verified via DevTools that Queue's live DOM row count stays in the
  ~20-35 range regardless of total list size, confirming virtualization
  is genuinely active, not just visually similar by coincidence.

### Dependencies

**msw** — used to mock the REST API contract from section 7. Chosen over
`json-server` specifically because several endpoints need real custom
logic (role-based filtering, status-lifecycle legality checks, 403s) that
`json-server` isn't well suited for without extensive custom routing,
per the spec's own tools table. MSW intercepts real `fetch` calls at the
browser level, so application code is identical to what it would be
against a real backend — confirmed directly: swapping to a real backend
later requires no changes to any component, hook, or page, only to
`src/mocks/` and one base-URL line in the API client.

**@tanstack/react-query** — adopted once a real API existed to manage
state against (not earlier — there was no genuine caching problem to
solve on fixtures). Handles loading/error/retry state, request
deduplication, and cache invalidation after mutations, replacing what
would otherwise be several hundred lines of hand-rolled equivalent logic
across every data-fetching hook.

**@tanstack/react-virtual** — a headless virtualization primitive, not a
styled component library, so it doesn't conflict with the "no full UI
kit" restriction — every visual element (rows, badges) is still hand-
built. Chosen over hand-rolling scroll-position/windowing math, which
would require correctly handling variable row heights, resize
recalculation, and overscan buffering — real engineering disproportionate
to reimplement from scratch for a 2-week project.

Considered `react-hook-form` and `zod` again for the create-request form;
still not adopted, for the same reasons as Day 4 — the form is small
enough that hand-written validation remains equally clear with zero
dependencies.

## Known limitations (expected at this stage)

- No route protection yet — any role can visit any of the five routes
  directly by URL; Day 6 adds real login, logout, and protected routing.
- The dev role switcher (`DevRoleSwitcher`) is temporary scaffolding,
  deleted once real login exists.
- `requestsDb`/`messagesDb` are in-memory and reset on a full page
  reload or dev-server restart — expected for a mock data layer; a real
  backend would persist this properly.
- Comment/message deletion is intentionally out of scope — the spec
  treats the activity thread as an append-only record, consistent with
  how real support-desk tools treat ticket history, and no action rule
  in section 5 mentions deleting or editing messages for any role.