/**
 * Daily cross-check: compares ESPN results + standings against TheSportsDB (league 4791).
 * Run: npm run crosscheck   (exit code 1 when mismatches are found)
 */
import { espn } from "../lib/providers/espn";
import { CLUBS } from "../lib/clubs";

const TSDB = "https://www.thesportsdb.com/api/v1/json/123";
const LEAGUE = 4791;
const SEASON = process.env.TSDB_SEASON ?? "2026-2027";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
function clubIdFor(tsdbName: string): string | undefined {
  const n = norm(tsdbName);
  return CLUBS.find((c) => c.tsdb.some((k) => n.includes(norm(k))))?.id;
}
async function j(url: string) { const r = await fetch(url); if (!r.ok) throw new Error(`${r.status} ${url}`); return r.json(); }

async function main() {
  const issues: string[] = [];
  const [fixtures, table, past, tt] = await Promise.all([
    espn.getFixtures(), espn.getStandings(),
    j(`${TSDB}/eventspastleague.php?id=${LEAGUE}`), j(`${TSDB}/lookuptable.php?l=${LEAGUE}&s=${SEASON}`),
  ]);
  const done = fixtures.filter((m) => m.state === "post");
  let compared = 0;
  for (const e of past.events ?? []) {
    if (e.strSeason !== SEASON || e.intHomeScore == null) continue;
    const h = clubIdFor(e.strHomeTeam), a = clubIdFor(e.strAwayTeam);
    if (!h || !a) { issues.push(`unmapped TSDB team: ${e.strHomeTeam} / ${e.strAwayTeam}`); continue; }
    const m = done.find((x) => x.home.id === h && x.away.id === a && Math.abs(+new Date(x.kickoff) - +new Date(e.strTimestamp + "Z")) < 2 * 864e5);
    if (!m) { issues.push(`result missing in ESPN: ${e.strEvent} (${e.dateEvent})`); continue; }
    compared++;
    if (m.home.score !== Number(e.intHomeScore) || m.away.score !== Number(e.intAwayScore))
      issues.push(`score mismatch ${e.strEvent}: ESPN ${m.home.score}-${m.away.score} vs TSDB ${e.intHomeScore}-${e.intAwayScore} (espn id ${m.id})`);
  }
  for (const r of tt.table ?? []) {
    const id = clubIdFor(r.strTeam);
    const er = table.find((x) => x.team.id === id);
    if (!er) { issues.push(`table: ${r.strTeam} not in ESPN table`); continue; }
    if (er.points !== Number(r.intPoints) || er.played !== Number(r.intPlayed))
      issues.push(`table mismatch ${r.strTeam}: ESPN P${er.played} ${er.points}pts vs TSDB P${r.intPlayed} ${r.intPoints}pts`);
  }
  const stamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  console.log(`[crosscheck ${stamp} IST] results compared: ${compared}, table rows: ${(tt.table ?? []).length}, mismatches: ${issues.length}`);
  for (const i of issues) console.log("  MISMATCH", i);
  if (issues.length) process.exitCode = 1;
}
main().catch((e) => { console.error("crosscheck failed:", e); process.exitCode = 2; });
