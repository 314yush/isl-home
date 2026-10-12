import watch from "@/data/watch.json";
import type { Match } from "./types";
export type WatchInfo = { broadcast: string; streams: { label: string; url: string; free: boolean }[]; note?: string };
type Corr = Partial<{ homeScore: number; awayScore: number; state: Match["state"]; statusText: string; kickoff: string }>;
const W = watch as unknown as { default: WatchInfo; matches: Record<string, Partial<WatchInfo>>; corrections: Record<string, Corr> };
export const watchFor = (id: string): WatchInfo => ({ ...W.default, ...(W.matches[id] ?? {}) });
export function applyCorrection(m: Match): Match {
  const c = W.corrections[m.id];
  if (!c) return m;
  return { ...m, state: c.state ?? m.state, statusText: c.statusText ?? m.statusText, kickoff: c.kickoff ?? m.kickoff,
    home: { ...m.home, score: c.homeScore ?? m.home.score }, away: { ...m.away, score: c.awayScore ?? m.away.score } };
}
