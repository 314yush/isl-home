/**
 * ESPN adapter. ALL ESPN-specific code lives in this file.
 * Unofficial, undocumented endpoints; personal/non-commercial use only.
 */
import type {
  FootballProvider,
  Match,
  MatchDetail,
  MatchEvent,
  MatchState,
  StandingRow,
  SquadPlayer,
  Team,
  TeamStat,
  LineupPlayer,
  EventKind,
} from "../types";

import { parsePreview } from "./espnPreview";

const LEAGUE = "ind.1";
const SITE = `https://site.api.espn.com/apis/site/v2/sports/soccer/${LEAGUE}`;
const STANDINGS = `https://site.api.espn.com/apis/v2/sports/soccer/${LEAGUE}/standings`;

/* eslint-disable @typescript-eslint/no-explicit-any */
async function get(url: string): Promise<any> {
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "accept-encoding": "gzip",
      "user-agent": "Mozilla/5.0 (fan site)",
    },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`ESPN ${res.status} ${url}`);
  const j = await res.json();
  if (j && j.code && j.code >= 400)
    throw new Error(`ESPN ${j.code}: ${j.message}`);
  return j;
}

const teamRef = (t: any) => ({
  id: String(t.id),
  name: t.displayName ?? t.name,
  shortName: t.shortDisplayName ?? t.displayName,
  abbr: t.abbreviation,
});

function state(st: any): MatchState {
  const n: string = st?.type?.name ?? "";
  if (/POSTPONED|CANCELED|ABANDON/.test(n)) return "postponed";
  return (st?.type?.state as MatchState) ?? "pre";
}
function statusText(st: any): string {
  const s = state(st);
  if (s === "in")
    return st.type?.name === "STATUS_HALFTIME"
      ? "HT"
      : (st.displayClock ?? "LIVE");
  if (s === "post") return st.type?.shortDetail ?? "FT";
  if (s === "postponed") return "PPD";
  return "";
}

function toMatch(ev: any): Match {
  const c = ev.competitions?.[0] ?? ev;
  const st = c.status ?? ev.status;
  const side = (h: string) => {
    const x = c.competitors.find((k: any) => k.homeAway === h);
    const s = state(st);
    return {
      ...teamRef(x.team),
      score:
        s === "pre" || x.score == null
          ? null
          : Number(
              typeof x.score === "object"
                ? (x.score.value ?? x.score.displayValue)
                : x.score,
            ),
      winner: x.winner,
    };
  };
  return {
    id: String(ev.id),
    kickoff: ev.date ?? c.date,
    state: state(st),
    statusText: statusText(st),
    clock: st?.displayClock,
    home: side("home"),
    away: side("away"),
    venue: c.venue?.fullName,
    city: c.venue?.address?.city,
  };
}

const ymd = (iso: string) => iso.slice(0, 10).replace(/-/g, "");

async function pool<T, R>(
  items: T[],
  n: number,
  fn: (t: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) {
        const k = i++;
        out[k] = await fn(items[k]);
      }
    }),
  );
  return out;
}

function kindOf(t: string): EventKind | null {
  if (t === "goal" || t.startsWith("goal"))
    return t.includes("penalty") ? "penalty" : "goal";
  if (t === "own-goal") return "own-goal";
  if (t.includes("penalty") && t.includes("scored")) return "penalty";
  if (t === "yellow-card") return "yellow";
  if (t === "red-card" || t === "yellow-red-card") return "red";
  if (t === "substitution") return "sub";
  return null;
}

const num = (s: string) => {
  const n = parseFloat(String(s).replace("%", ""));
  return isNaN(n) ? 0 : n;
};
const STAT_KEYS: [string, string][] = [
  ["possessionPct", "Possession %"],
  ["totalShots", "Shots"],
  ["shotsOnTarget", "Shots on target"],
  ["accuratePasses", "Accurate passes"],
  ["passPct", "Pass accuracy %"],
  ["wonCorners", "Corners"],
  ["foulsCommitted", "Fouls"],
  ["offsides", "Offsides"],
  ["saves", "Saves"],
  ["effectiveTackles", "Tackles won"],
  ["interceptions", "Interceptions"],
  ["yellowCards", "Yellow cards"],
  ["redCards", "Red cards"],
];

export const espn: FootballProvider = {
  name: "espn",
  attribution: "ESPN",

  async getLiveScores() {
    const j = await get(`${SITE}/scoreboard`);
    return (j.events ?? []).map(toMatch);
  },

  async getFixtures() {
    const sb = await get(`${SITE}/scoreboard`);
    const cal: string[] = sb.leagues?.[0]?.calendar ?? [];
    const days = [
      ...new Set(
        cal.map((d) => ymd(typeof d === "string" ? d : (d as any).startDate)),
      ),
    ];
    const res = await pool(days, 6, (d) =>
      get(`${SITE}/scoreboard?dates=${d}`).then(
        (j) => (j.events ?? []).map(toMatch) as Match[],
      ),
    );
    const map = new Map<string, Match>();
    for (const m of [...res.flat(), ...(sb.events ?? []).map(toMatch)])
      map.set(m.id, m);
    if (days.length && map.size === 0) throw new Error("ESPN fixtures empty");
    return [...map.values()].sort((a, b) => a.kickoff.localeCompare(b.kickoff));
  },

  async getStandings() {
    const j = await get(STANDINGS);
    const entries: any[] =
      j.children?.[0]?.standings?.entries ?? j.standings?.entries ?? [];
    const rows: StandingRow[] = entries.map((e) => {
      const s = Object.fromEntries(
        e.stats.map((x: any) => [x.name, x.value ?? num(x.displayValue)]),
      );
      return {
        rank: s.rank,
        team: teamRef(e.team),
        played: s.gamesPlayed,
        won: s.wins,
        drawn: s.ties,
        lost: s.losses,
        gf: s.pointsFor,
        ga: s.pointsAgainst,
        gd: s.pointDifferential,
        points: s.points,
      };
    });
    return rows.sort((a, b) => a.rank - b.rank);
  },

  async getMatchDetail(id) {
    const j = await get(`${SITE}/summary?event=${encodeURIComponent(id)}`);
    if (!j.header) return null;
    const match = toMatch({ ...j.header, date: j.header.competitions[0].date });
    match.venue = j.gameInfo?.venue?.fullName ?? match.venue;
    match.city = j.gameInfo?.venue?.address?.city ?? match.city;

    const events: MatchEvent[] = [];
    for (const k of j.keyEvents ?? []) {
      const kind = kindOf(k.type?.type ?? "");
      if (!kind) continue;
      const ps = (k.participants ?? []).map((p: any) => p.athlete?.displayName);
      events.push({
        minute: k.clock?.displayValue ?? "",
        kind,
        teamId: String(k.team?.id ?? ""),
        player: ps[0] ?? k.shortText ?? "",
        detail:
          kind === "sub" && ps[1]
            ? `on for ${ps[1]}`
            : kind === "own-goal"
              ? "Own goal"
              : kind === "penalty"
                ? "Penalty"
                : kind === "yellow"
                  ? "Yellow card"
                  : kind === "red"
                    ? "Red card"
                    : ps[1]
                      ? `Assist: ${ps[1]}`
                      : undefined,
      });
    }

    const bt: any[] = j.boxscore?.teams ?? [];
    const homeId = match.home.id;
    const bh = bt.find((t) => String(t.team.id) === homeId),
      ba = bt.find((t) => String(t.team.id) !== homeId);
    const stats: TeamStat[] = [];
    if (bh && ba) {
      const H = Object.fromEntries(
        (bh.statistics ?? []).map((s: any) => [s.name, s.displayValue]),
      );
      const A = Object.fromEntries(
        (ba.statistics ?? []).map((s: any) => [s.name, s.displayValue]),
      );
      for (const [k, label] of STAT_KEYS)
        if (H[k] != null && A[k] != null) {
          const pct = k.endsWith("Pct");
          const hv = pct && num(H[k]) <= 1 ? num(H[k]) * 100 : num(H[k]);
          const av = pct && num(A[k]) <= 1 ? num(A[k]) * 100 : num(A[k]);
          stats.push({
            key: k,
            label,
            home: hv,
            away: av,
            homeDisplay: pct ? `${Math.round(hv)}` : H[k],
            awayDisplay: pct ? `${Math.round(av)}` : A[k],
          });
        }
    }

    const ros = (h: string) => {
      const r = (j.rosters ?? []).find((x: any) => x.homeAway === h);
      if (!r?.roster?.length) return null;
      return {
        formation: r.formation,
        players: r.roster.map((p: any): LineupPlayer => ({
          name: p.athlete.displayName,
          shortName: p.athlete.shortName ?? p.athlete.displayName,
          number: p.jersey ?? "",
          position: p.position?.abbreviation ?? "",
          starter: !!p.starter,
          subbedIn: !!p.subbedIn,
          subbedOut: !!p.subbedOut,
        })),
      };
    };
    const lh = ros("home"),
      la = ros("away");
    return {
      match,
      events,
      stats,
      lineups: lh && la ? { home: lh, away: la } : null,
      attendance: j.gameInfo?.attendance || undefined,
      preview: parsePreview(j, match),
    } satisfies MatchDetail;
  },

  async getTeams() {
    const j = await get(`${SITE}/teams`);
    return (j.sports?.[0]?.leagues?.[0]?.teams ?? []).map((t: any): Team =>
      teamRef(t.team),
    );
  },

  async getSquad(teamId) {
    const j = await get(`${SITE}/teams/${encodeURIComponent(teamId)}/roster`);
    return (j.athletes ?? []).map((a: any): SquadPlayer => ({
      id: String(a.id),
      name: a.displayName,
      number: a.jersey,
      position: a.position?.displayName ?? "",
      age: a.age,
      nationality: a.citizenship,
    }));
  },
};
