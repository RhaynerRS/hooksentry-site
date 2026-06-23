# HookSentry Site — Roadmap

## Upcoming

| Feature | Depends on | Priority |
|---------|------------|----------|
| Queue purge UI | API: purge endpoint | Medium |
| SSE — real-time updates | API: SSE endpoints | Medium |
| In-app notification system | API: notification endpoints + SSE | Medium |

---

### Queue purge UI

Let an Admin cancel all `Pending` / `WaitingRetry` events for the Tenant with explicit confirmation.

- "Danger Zone" card on the Settings page (similar to `danger-zone-card.tsx` on destinations)
- Visible only to users with the `Admin` role
- Confirmation modal with a warning before executing — the operation is irreversible
- Feedback after execution: number of events cancelled
- Button disabled while the request is in flight

---

### SSE — real-time updates

Single `useTenantStream()` hook that opens one SSE connection to `GET /api/v1/stream` and fans events out to each page. No polling anywhere.

**Pages updated in real time:**

| Page | Events consumed |
|------|----------------|
| Dashboard overview | `event.created`, `event.updated` — refreshes stats and chart |
| Events list | `event.created`, `event.updated` — inserts/updates rows in place |
| Event detail | `event.updated` — updates status badge and timeline |
| Destinations list | `destination.created`, `destination.updated`, `destination.deleted` |
| Destination detail | `destination.updated` — Circuit Breaker card, info card |
| Senders list | `sender.created`, `sender.deleted` |
| API Keys list | `apikey.created`, `apikey.deleted` |
| Users / Invites | `user.created`, `user.updated`, `user.deleted` |
| Settings | `tenant.updated` — reflects changes made by another Admin session |

- Automatic reconnection with exponential backoff via native browser `EventSource`
- Polling fallback when `EventSource` is unavailable (proxy environments that block streaming)
- `notification.created` SSE event increments the bell badge without a separate connection
- Connection opened on dashboard layout mount; closed on unmount

---

### In-app notification system

Bell icon in the sidebar/header with an unread badge. Notifications persist server-side — users see history even after reconnecting.

- Bell icon with unread count badge, updated live via `notification.created` SSE event
- Dropdown panel listing recent notifications (title, relative timestamp, read/unread state)
- "Mark all as read" action
- Click on a notification navigates to the relevant resource (e.g. destination detail for a CB notification)
- Notifications are Tenant-wide — all users in the Tenant share the same feed

---

## Backlog

| Feature | Motivation |
|---------|------------|
| Critical failure notifications | Alert by email or webhook when an event reaches `CriticalFailure` — configurable per destination |
| Aggregated metrics endpoint in overview | Replace the 4 parallel queries in `OverviewStats` with a dedicated API endpoint |
| Volume chart per destination | Expand `OverviewChart` to filter by a specific destination |
| Alert configuration | UI to define thresholds (e.g. success rate < 90%) that trigger notifications |
