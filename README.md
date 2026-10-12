# Matchday — fan-run ISL matchday hub

Fan-run, no-ads, non-commercial Indian Super League hub: live scores ticker, matchday hub, fixtures in IST, table, match centre (events, stats, lineups on a pitch) and club pages.
Not affiliated with the ISL, AIFF or any club. Club crests, the league logo and photos are third-party assets listed in `lib/assets.ts` (one map; delete an entry to fall back to monograms/initials/gradients) and credited at `/credits` and `public/CREDITS.md`.

> The site name is a placeholder. Rename it in **`lib/brand.ts`** (name, tagline, monogram); nothing else hard-codes it.

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind v4 · Barlow / Barlow Condensed via `next/font`.

## Setup
```bash
npm install
cp .env.example .env.local   # optional, everything works with no env vars
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Env vars (all optional)
| Var | Purpose |
|---|---|
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Shared Redis cache (recommended on Vercel so all serverless instances share one cache). Falls back to in-memory. |
| `DATA_PROVIDER` | `espn` (default) or `api-football`. |
| `API_FOOTBALL_KEY`, `API_FOOTBALL_SEASON` | For the API-Football adapter (league 323). Not required today. |
| `TSDB_SEASON` | Season label for the TheSportsDB cross-check (default `2026-2027`). |

## Data architecture
- **Provider adapter:** all ESPN code is in `lib/providers/espn.ts` (league slug `ind.1`, unofficial public feed, personal/non-commercial terms). It implements the normalized `FootballProvider` interface in `lib/types.ts`: fixtures, live scores, standings, match detail (events, lineups, team stats), teams, squads.
- **Cache:** `lib/cache.ts`. Visitors never hit ESPN; every read goes through a stale-while-error cache (Upstash Redis if configured, otherwise memory) with in-flight de-duplication. TTLs: live 30 s, matchday/match detail 60 s (30 s while live), fixtures/standings/squads 6 h. Today's scoreboard (30 s) is merged over the 6 h fixture list so results update fast.
- **Failures:** if ESPN errors or returns empty, the last good copy is served and a yellow stale-data banner shows.
- **Health:** `GET /api/health` → `{ ok, provider, cache, lastSuccess, keys:[{key,lastSuccess,ageSec,ttlSec,stale,lastError}] }`, 503 when core data is stale. Point an uptime monitor at it.
- **Cross-check:** `npm run crosscheck` compares ESPN results and table against TheSportsDB (league 4791, free key `123`) and logs mismatches (exit 1 if any). `.github/workflows/crosscheck.yml` runs it daily at 06:00 IST.
- **Hand-edited data:** `data/watch.json` holds where-to-watch info (default + per-match overrides keyed by ESPN event id) and `corrections` (override score/status/kick-off for a match id if the feed is wrong).
- **Club identity:** `lib/clubs.ts` (slug, monogram, colours, TheSportsDB name aliases), keyed by ESPN team id.

## Swapping providers (e.g. to API-Football, $19/mo Pro)
1. Implement the TODOs in `lib/providers/apiFootball.ts` (league **323**), mapping responses to the types in `lib/types.ts`.
2. Map API-Football team ids to clubs: add them in `lib/clubs.ts` (or switch the `id` field) since badges/colours are keyed by team id.
3. Set `DATA_PROVIDER=api-football` and `API_FOOTBALL_KEY`. No page code changes.

## Deploy to Vercel
1. Push this repo to GitHub.
2. vercel.com → Add New → Project → import the repo (framework auto-detected, no build settings needed).
3. Optional: Vercel Marketplace → Upstash Redis → connect to the project (adds the two `UPSTASH_*` vars). Redeploy.
4. Check `https://<your-app>.vercel.app/api/health`.
Or via CLI: `npm i -g vercel && vercel && vercel --prod`.
Vercel's Hobby plan is for non-commercial use, which matches the no-ads plan.

## Screenshots
`npm run build && PORT=3100 npm start`, then `npm run screenshots` (Python Playwright + Chrome) writes `screenshots/*.png`.

## Known gaps
- No news feed yet: the home page links out to publishers.
- ESPN gives no matchweek numbers; "This week" is the IST Mon–Sun week of the next match.
- Live polling (30 s) is untested during an actual live match.
- Lineup pitch placement is derived from ESPN position codes (approximate for unusual shapes).
