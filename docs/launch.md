# Maidan launch

## Architecture

The Next.js application is both frontend and backend. Server components fetch football data; server-side caching keeps provider calls out of browsers. Deploy as a Next.js/Node application, not a static export. No separate API server or account database is required. Favourite clubs remain in browser storage. Stories and verified ticket links remain in the repository.

Use shared Upstash Redis in production. Memory-only caching is per instance and disappears on cold starts. Current cache deduplication is per process: Redis shares results but does not provide a distributed refresh lock or enforce a daily provider quota.

## Configure and deploy

1. Use Node 22 and import the repository into a Next.js hosting project (Vercel is the default target). Install with `npm ci`, build with `npm run build`.
2. Set `SITE_URL` to the final HTTPS origin. Set `DATA_PROVIDER=espn`. Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in the host's secret environment settings. Do not prefix secrets with `NEXT_PUBLIC_` or paste them into source control.
3. Use a separate Redis database for preview deployments. Preview deployments on Vercel are marked noindex; other hosts should leave SITE_URL unset for previews. Robots instructions are not access controls.
4. Run `npm run launch:check` with production configuration loaded, then `npm test`, `npm run lint`, and `npm run build`. The configuration check reports presence, not credential validity.
5. Deploy a preview and verify the homepage, fixtures filters, saved club, upcoming and completed match centres, mobile navigation and external ticket links. Confirm lineup-first ordering near kickoff and events-first ordering during live play. Browser visual verification is still outstanding.
6. Configure the domain and HTTPS, deploy production with its production environment variables, then check `/robots.txt`, `/sitemap.xml`, and `/api/health`. Expect health HTTP 200 and cache `upstash-redis`. The cache label reports configured backend; additionally confirm successful commands in the Redis dashboard because Redis failures currently fall back to memory.
7. Monitor `/api/health` every five minutes and alert on repeated failures. This endpoint fetches core football data through the cache; it is not a zero-cost liveness ping. Check actual score freshness during the first live match.
8. Roll back to the previous deployment if navigation, data freshness or match rendering breaks. Retain the same environment variables and shared cache.

## Remaining launch decisions

- Production domain, hosting project and Redis credentials have not been supplied or provisioned by this work.
- ESPN is the user-approved launch provider. It is an unofficial endpoint integration, without a service guarantee. API-Football remains a stub; do not select it. A future integration needs verified ISL season coverage, team-ID mapping and a shared daily request budget before it can replace or supplement ESPN.
- Recheck the supplied District links and broadcast information against each fixture before promotion.
- Run `npm audit` before release and review outstanding dependency advisories; the previous audit recorded transitive findings, not a clean dependency audit.
- No deployment or DNS changes have been performed by these launch preparations.

## Mobile verification status

Code review and DOM interaction tests completed; fixed bottom navigation and page spacing now include the iPhone safe-area inset. Actual mobile browser rendering and touch verification remain pending: the browser tool reported no connected browsers. Do not treat passing DOM tests as visual sign-off.
