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

## Known limitations (expected at this stage)

- Cancelling a request only updates local component state — it resets on
  reload. Real persistence via `PATCH /requests/:id` arrives Day 5.
- Creating a request simulates a delay and redirects, but doesn't actually
  add the new request to the list yet — same reason as above.
- The cancel button is gated on request status only, not on "is this
  actually the request's owner" — anyone, including staff viewing from
  Queue, currently sees it on any open request. Full requester-only +
  ownership enforcement (and the matching API 403) arrives Day 6 once a
  logged-in user exists.
- `fetchRequests()` never actually rejects yet, since it's reading static
  fixtures — the error UI is built and ready, but a genuine failure case
  only becomes possible once Day 5's real API can actually fail.
- `/login` is still a placeholder page; the real form arrives Day 6.