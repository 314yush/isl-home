# Maidan — the home of Indian football fans

An independent, fan-run Indian Super League site built with Next.js 15 App Router, React 19, TypeScript and Tailwind 4. No accounts, ads or paid memberships.

## Run locally

```bash
npm ci
cp .env.example .env.local # optional; ESPN works without credentials
npm run dev
```

Use Node 22 LTS (some development dependencies require Node 20.19+). Production: `npm run build`, then `npm start`.

## What’s included

- Editorial homepage with stadium photography, upcoming/live matches, standings, stories and club discovery.
- Fixtures and results filtered by status, club, month and search. All kick-offs in IST.
- Match centres with key events, statistics, formations and lineups. Upcoming games include recent head-to-head meetings, team form, standings context and dated, sourced news links.
- District tickets linked inside match headers, fixture rows and match cards. Verified event URLs are matched by event ID, teams and date; other upcoming fixtures offer a clearly labelled matchup search.
- Full standings with recent form, plus club statistics derived from the standings feed.
- Searchable club directory and club hubs with fixtures, squads and nearby table positions.
- My club: a favourite saved in browser local storage, with next match and latest result. No server account.
- Original fan guides and story detail pages; links to independent news publishers are explicitly external.
- Image attribution, about page, loading/error/404 states, keyboard focus treatment and reduced-motion support.

Branding lives in `lib/brand.ts`; stories in `lib/stories.ts`; club identities in `lib/clubs.ts`; credited assets in `lib/assets.ts` and `public/CREDITS.md`.

## Data

`lib/providers/espn.ts` normalizes ESPN’s unofficial public feed into `lib/types.ts`. `lib/data.ts` combines cached season fixtures with the current scoreboard, applies hand-maintained corrections and supplies page metadata.

The cache (`lib/cache.ts`) uses memory by default or Upstash Redis when configured. Expired local entries check the shared cache for a newer version. In-flight work is deduplicated per process. Live scores refresh at 30 seconds, match details at 30–60 seconds, standings at 60 seconds, and season fixtures and squads at six hours. Failed requests retain the last successful copy with a stale notice and a short retry backoff. Empty scoreboards are valid; empty core fixture/table responses are failures. A failed calendar-day fetch rejects the season refresh rather than publishing an incomplete schedule.

Match, fixture, home, table, statistics, club and My club pages refresh while visible, including before kick-off. Upstream feed updates may still be delayed. Cold fixture loads require several requests and can take a few seconds.

`GET /api/health` warms the core keys and returns cache health; unhealthy core data returns 503. `npm run crosscheck` compares the feed to TheSportsDB; the daily GitHub Actions workflow runs this independently of page requests.

### Optional configuration

| Variable                                             | Purpose                                                                                                   |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Shared cache; recommended for serverless deployments                                                      |
| `DATA_PROVIDER`                                      | Defaults to `espn`; the `api-football` adapter remains a stub and must be implemented before selecting it |
| `API_FOOTBALL_KEY`, `API_FOOTBALL_SEASON`            | Reserved for the alternative adapter                                                                      |
| `TSDB_SEASON`                                        | Season used by the cross-check script                                                                     |

`data/tickets.json` contains verified District event URLs and the fixture identity/date they belong to. Recheck these listings when fixtures move; prices and availability are left to District. `lib/match-context.ts` contains curated reading, filtered by team and recency, alongside relevant ESPN headlines. H2H shows only the recent meetings supplied by ESPN, not all-time totals.

`data/watch.json` contains manually maintained watch links and match corrections. Confirm broadcast/ticket/venue information with official sources. Archive photography illustrates football culture and does not depict current match results.

## Verification

```bash
npm test          # cache/provider regressions and DOM interaction tests
npm run lint
npm run typecheck
npm run build
```

Interaction tests use JSDOM and React Testing Library to exercise fixture filtering, club search, and favourite persistence/removal. These do not replace visual browser checks. The original screenshot helper in `scripts/shots.py` requires Python Playwright and a locally configured Chrome executable.

The October 2026 rebuild passed production compilation and live HTTP route checks. A connected browser was unavailable for visual verification. An npm audit reports seven inherited/transitive findings in the Next.js PostCSS and ESLint glob dependencies; dependency modernization remains separate work.

## Deployment

See [the launch runbook](docs/launch.md) for infrastructure, environment variables, verification and rollback. Run `npm run launch:check` with production configuration before release. Set `SITE_URL` to enable production indexing and sitemap URLs; previews stay noindex on Vercel.

Deploy the repository as a Next.js project on Vercel or another Node host. Configure optional Redis variables, build, and check `/api/health`. No deployment has been performed as part of the local rebuild.

Not affiliated with the ISL, AIFF or any club. See `/credits` for third-party assets and their sources.
