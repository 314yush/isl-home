import "server-only";
import { cached, TTL, type Cached } from "./cache";
import { provider } from "./providers";
import { applyCorrection } from "./watch";
import type { Match } from "./types";

const fix = (ms: Match[]) => ms.map(applyCorrection);
export type Meta = { stale: boolean; fetchedAt: number | null; error: string | null };
const meta = (...cs: Cached<unknown>[]): Meta => ({
  stale: cs.some((c) => c.stale),
  fetchedAt: Math.min(...cs.map((c) => c.fetchedAt ?? 0)) || null,
  error: cs.map((c) => c.error).filter(Boolean)[0] ?? null,
});

export async function getLive() {
  // 30s if anything is live, otherwise matchday TTL
  const prev = await cached("live", TTL.live, () => provider.getLiveScores(), (d) => d.length === 0);
  return prev;
}

/** Fixtures (6h) merged with today's scoreboard (30s) so results are fresh. */
export async function getAllMatches() {
  const [f, l] = await Promise.all([cached("fixtures", TTL.long, () => provider.getFixtures(), (d) => d.length === 0), getLive()]);
  const map = new Map<string, Match>();
  for (const m of f.data ?? []) map.set(m.id, m);
  for (const m of l.data ?? []) map.set(m.id, m);
  const matches = fix([...map.values()].sort((a, b) => a.kickoff.localeCompare(b.kickoff)));
  return { matches, meta: meta(f, l) };
}

export async function getStandings() {
  const s = await cached("standings", TTL.long, () => provider.getStandings(), (d) => d.length === 0);
  return { rows: s.data ?? [], meta: meta(s) };
}

export async function getMatch(id: string) {
  // first peek: live matches need 30s, others 60s (matchday). Finished matches can live long.
  const peek = await cached(`match:${id}`, TTL.matchday, () => provider.getMatchDetail(id));
  let r = peek;
  if (peek.data?.match.state === "post" && peek.fetchedAt && Date.now() - new Date(peek.data.match.kickoff).getTime() > 6 * 3600e3) r = peek;
  else if (peek.data?.match.state === "in") r = await cached(`match:${id}`, TTL.live, () => provider.getMatchDetail(id));
  const d = r.data ? { ...r.data, match: applyCorrection(r.data.match) } : null;
  return { detail: d, meta: meta(r) };
}

export async function getSquad(teamId: string) {
  const s = await cached(`squad:${teamId}`, TTL.long, () => provider.getSquad(teamId), (d) => d.length === 0);
  return { squad: s.data ?? [], meta: meta(s) };
}

export const attribution = provider.attribution;
