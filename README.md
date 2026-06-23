<div align="center">
  <img src="refs/icon.svg" width="80" alt="HookSentry" />
  <h1>HookSentry Site</h1>
  <p><strong>Management dashboard for the HookSentry webhook delivery platform</strong></p>
  <p>Built with Next.js 15 App Router, React 19, Tailwind CSS, and Shadcn UI.</p>
</div>

---

## Getting Started

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API must be running at the URL set in `HOOKSENTRY_API_URL`.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HOOKSENTRY_API_URL` | `http://localhost:5000` | HookSentry API base URL (server-side proxy) |
| `GRAFANA_URL` | `http://localhost:3001` | Grafana URL linked from the dashboard |

All API calls are proxied through Next.js server components — the API URL is never exposed to the browser.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Email + password login |
| `/register` | Self-registration |
| `/invite/[token]` | Accept an invite link and create account |
| `/dashboard` | Overview: stats, delivery chart, open circuit breakers, recent critical events |
| `/dashboard/events` | Event list with filters; detail and replay |
| `/dashboard/destinations` | Destination list; create, edit, rotate ingest token |
| `/dashboard/destinations/[id]` | Destination detail: info, ingest token, senders, circuit breaker, danger zone |
| `/dashboard/senders` | Sender list |
| `/dashboard/senders/[id]` | Sender detail: info, ingest token, payload mapping |
| `/dashboard/senders/[id]/mapping` | Edit sender payload mapping DSL |
| `/dashboard/api-keys` | API key list; create and revoke |
| `/dashboard/users` | User list and invite management |
| `/dashboard/settings` | Tenant info, resilience settings, HMAC secret, integration guide |

## Tech Stack

| | |
|-|--|
| Framework | Next.js 15 (App Router) |
| Runtime | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS + Shadcn UI (Radix UI primitives) |
| Charts | Recharts |
| i18n | next-intl |
| Bundler alt | vinext (Vite-based Next.js) |

## Scripts

```bash
npm run dev          # Next.js dev server
npm run build        # Next.js production build
npm run start        # Serve production build
npm run lint         # ESLint

npm run dev:vinext   # vinext dev server
npm run build:vinext # vinext production build
npm run start:vinext # Serve vinext build
```

## Auth

Authentication uses regular HTTP cookies managed by the Next.js server layer. The access token and refresh token are stored in `httpOnly` cookies and never exposed to client-side JavaScript. The middleware at [`middleware.ts`](middleware.ts) protects all `/dashboard` routes and redirects unauthenticated requests to `/login`.

## Docker

```bash
docker build -t hooksentry-site .
docker run -p 3000:3000 \
  -e HOOKSENTRY_API_URL=http://api:8080 \
  -e GRAFANA_URL=http://grafana:3001 \
  hooksentry-site
```

## License

Licensed under the [Apache License 2.0](./LICENSE).
