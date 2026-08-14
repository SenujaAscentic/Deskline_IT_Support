# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Deskline is an internal IT/facilities request desk (requesters file requests; technicians/admins work them in a shared queue), built as a structured learning exercise against `DESKLINE-INTERN-SPEC.md`. That spec is the authoritative source for scope, roles, routes, the API contract, and what is explicitly out of scope — read it before making product decisions. `README.md`'s "Decisions" section is a day-by-day log of *why* things are built the way they are (folder structure, dependency choices, styling approach, Queue performance strategy); check it before re-deriving a design decision or re-evaluating a dependency that was already considered and rejected.

## Commands

```
npm run dev       # start Vite dev server
npm run build      # tsc -b type-check, then vite build
npm run lint       # eslint .
npm run test       # vitest run (single run, all tests)
npm run preview    # preview production build
```

Run a single test file: `npx vitest run src/app/features/requests/filterRequests.test.ts`
Run tests in watch mode: `npx vitest`

There is no separate test-mocking setup step — Vitest tests import pure functions directly (e.g. `filterRequests`) rather than going through MSW/the API layer.

## Architecture

### Mock API is a real network boundary, not a fixture shim

From Day 5 onward, all data access goes through MSW (`src/mocks/handlers.ts`, `db.ts`, `browser.ts`), which intercepts real `fetch` calls at the browser level per the REST contract in spec section 7 (`POST /login`, `GET /users`, `GET /requests`, `GET /requests/:id`, `POST /requests`, `POST /requests/:id/messages`, `PATCH /requests/:id`). Application code (`src/app/shared/api/client.ts`'s `apiFetch`, and every hook built on it) is written as if talking to a real backend. Role-based visibility and the status-lifecycle legality table are enforced **inside the handlers**, returning real 403s — not just hidden in the UI. If you change an action rule, update it in both places:
- `src/mocks/handlers.ts` (`PATCH /requests/:id`) — the authoritative, enforced legality check.
- `src/app/features/requests/components/RequestActions.tsx` — the client-side mirror that decides which buttons render (`canCancel`, `canSetPending`, `canReopen`, `canAssignToMe`, `canReassign`, `canClose`).

A UI change alone does not make an action legal; the handler is what actually blocks it.

### Auth/session is a non-React external store

`src/app/features/auth/session.ts` holds the current session (`userId`, `name`, `role`, `token`) in a module-level variable, not React state, and exposes `subscribe`/`getSession`/`setSession`. `useSession.ts` bridges it into React via `useSyncExternalStore`. `apiFetch` reads `getSession()` directly and attaches `Authorization: Bearer dev-token-<userId>`; the mock handlers parse that header back into a user (`currentUser()` in `handlers.ts`). `setSession()` also calls `queryClientRef.clear()` (wired via `registerQueryClient` in `main.tsx`) — switching or clearing sessions wipes the entire TanStack Query cache so a new role can never read another role's cached data.

### UI/API type boundary

`src/app/shared/api/types.ts` holds wire types (`ApiRequestListItem`, `ApiRequestDetail`, `ApiMessage`); `src/app/features/requests/types.ts` holds UI types (`Request`, `Message`). `src/app/shared/api/mappers.ts` is the single place that converts between them. If a real backend's response shape ever diverges from the mock, this is the file to change — no component should import wire types directly.

### Query keys are scoped by user id

`src/app/shared/api/queryKeys.ts`'s `requests.all(userId)` includes the user id in the key deliberately — switching sessions must look like a genuinely different query, not a stale cache hit. Don't strip the userId out of a query key even if it looks redundant.

### Feature-folder structure

- `src/app/features/requests/` — the requests domain: `pages/` (route-level), `components/`, `hooks/` (one hook per query/mutation), plus root-level `types.ts`, `data.ts`, `filterRequests.ts`, `sortRequests.ts`, `api.ts` (each single-file with no siblings yet).
- `src/app/features/auth/` — stays flat (login page, session store, login mutation, `useSession`).
- `src/app/shared/` — cross-feature: `api/` (client, mappers, query keys, wire types), `components/` (state components, `ConfirmDialog`, `ProtectedRoute`, `ToggleSwitch`), `styles/`, `types.ts` (e.g. `Role`), `useTheme.ts`, `useReducedMotion.ts`.

A component only belongs in `shared/` if a second, unrelated feature actually consumes it — being used on two pages of the *same* feature isn't enough (see the README's Day 4 note on why `Badge` moved back into `features/requests/`).

### Routing and role gating

Exactly five routes are wired in `src/App.tsx`, per the spec (do not add more): `/login`, `/my-requests`, `/queue`, `/requests/new`, `/requests/:id`, plus a catch-all redirect to `/my-requests`. All except `/login` are wrapped in `src/app/shared/components/ProtectedRoute.tsx`, which redirects unauthenticated visitors to `/login` and wrongly-roled visitors to their own home route (`/my-requests` for requesters, `/queue` for staff) — not to `/login`, since they're already authenticated.

Roles: `requester` (My Requests, own requests only), `technician` (Queue, comment/set-pending/assign-self), `admin` (technician's abilities plus reassign/close). The full action matrix is in spec section 5 — consult it before changing who can do what.

### Styling and theming

No CSS framework or UI kit (explicitly out of scope per the spec). Global styles live under `src/app/shared/styles/` as layered files imported in dependency order in `App.tsx` (`tokens` → `base` → `layout` → `buttons` → `forms` → `states` → feature CSS → `motion` last, so its overrides win). Feature-specific styling (badges, request cards, dialogs, the login card) lives in `features/requests/requests.css` and `features/auth/auth.css` instead of `shared/`.

- **Theme**: `useTheme.ts` persists light/dark to `localStorage` and applies it via `data-theme` on `<html>`; all color values are CSS custom properties in `tokens.css`, so components never hardcode colors.
- **Reduced motion**: `useReducedMotion.ts` persists an explicit user choice to `localStorage`, falling back to the OS `prefers-reduced-motion` when no choice has been made. `motion.css` has one blanket override (`[data-motion="reduced"] * { transition: none; animation: none }`) rather than per-component conditionals.

### Queue performance (500+ rows)

`QueuePage` renders `VirtualizedRequestList.tsx` (built on `@tanstack/react-virtual`, headless) instead of the plain `RequestList.tsx` used by My Requests. Both share one `RequestRow.tsx` so row markup can't drift between the two screens. Filtering logic is a pure, unit-tested function (`filterRequests.ts`) reused by both `useRequestFilters` (My Requests) and `useQueueFilters` (Queue, which wraps `useRequestFilters` and adds the assignee filter) — don't duplicate filter logic per screen.

### Status lifecycle

Only these transitions are legal (enforced in `handlers.ts`, mirrored in `RequestActions.tsx`): `open → pending` and `pending → open` (technician/admin), `open → cancelled` (requester, own request only), `open or pending → closed` (admin only). `closed` and `cancelled` are terminal — no reopening. Comments are only postable while a request is `open` or `pending`; the comment box is entirely absent (not disabled) once terminal.

## Out of scope

Per spec section 8, do not add: realtime/websockets, file attachments, rich text/markdown, threaded replies, email/Slack integration, an "on behalf of" requester picker, a notifications center, SLA timers/analytics dashboards, drag-and-drop boards, SSO/OAuth/JWT, global state libraries (Redux, etc.), or a full UI kit (MUI, Chakra, etc.). If a task seems to need one of these, flag it rather than adding it.
