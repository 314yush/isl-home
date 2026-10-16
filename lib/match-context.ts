import type { HistoricalMatch, Match, MatchArticle } from "./types";
export function summarizeMeetings(current: Match, meetings: HistoricalMatch[]) {
  const valid = [
    ...new Map(
      meetings
        .filter(
          (m) =>
            m.state === "post" &&
            m.home.score !== null &&
            m.away.score !== null &&
            Number.isFinite(m.home.score) &&
            Number.isFinite(m.away.score) &&
            Date.parse(m.kickoff) < Date.parse(current.kickoff) &&
            [m.home.id, m.away.id].includes(current.home.id) &&
            [m.home.id, m.away.id].includes(current.away.id),
        )
        .map((m) => [m.id, m]),
    ).values(),
  ];
  let homeWins = 0,
    awayWins = 0,
    draws = 0;
  for (const m of valid) {
    if (m.home.score === m.away.score) draws++;
    else {
      const winner = m.home.score! > m.away.score! ? m.home.id : m.away.id;
      if (winner === current.home.id) homeWins++;
      else awayWins++;
    }
  }
  return { homeWins, awayWins, draws, total: valid.length };
}
export function formResult(
  m: HistoricalMatch,
  teamId: string,
): "W" | "D" | "L" | null {
  if (
    m.home.score === null ||
    m.away.score === null ||
    ![m.home.id, m.away.id].includes(teamId)
  )
    return null;
  const own = m.home.id === teamId ? m.home.score : m.away.score,
    other = m.home.id === teamId ? m.away.score : m.home.score;
  return own === other ? "D" : own > other ? "W" : "L";
}
const CURATED: (MatchArticle & { teams: string[] })[] = [
  {
    teams: ["18851", "131703"],
    title: "How Bengaluru turned their opener around",
    url: "https://www.indiansuperleague.com/news/fc-goa-fight-back-to-hold-chennaiyin-fc-to-1-1-draw",
    source: "Indian Super League",
    published: "2026-10-10",
    kind: "News",
  },
  {
    teams: ["18000", "18003"],
    title: "Chennaiyin and Goa share the points in Fatorda",
    url: "https://www.indiansuperleague.com/news/fc-goa-fight-back-to",
    source: "Indian Super League",
    published: "2026-10-10",
    kind: "News",
  },
  {
    teams: ["18000"],
    title: "Chennaiyin’s opening away run and the trip to Bengaluru",
    url: "https://chennaiyinfc.com/chennaiyin-fc-set-for-october-10-isl-campaign-kick-off-as-phase-one-fixtures-announced/",
    source: "Chennaiyin FC",
    published: "2026-09-26",
    kind: "Club update",
  },
  {
    teams: ["18004", "20774"],
    title: "NorthEast edge Mohun Bagan with a late winner",
    url: "https://www.indiansuperleague.com/news/jithin-strikes-at-death-as-northeast-united-fc-beat-mohun-bagan-sg",
    source: "Indian Super League",
    published: "2026-10-12",
    kind: "News",
  },
  {
    teams: ["8896", "18002"],
    title: "Churchill open their ISL campaign with a win over Mumbai",
    url: "https://www.indiansuperleague.com/news/churchill-brothers-sc-claim-historic-2-1-win-over-mumbai-city-fc",
    source: "Indian Super League",
    published: "2026-10-11",
    kind: "News",
  },
  {
    teams: ["17997", "22069"],
    title: "Kerala start with a win against Inter Kashi",
    url: "https://www.indiansuperleague.com/news/kerala-blasters-fc-beat-inter-kashi-2-0-to-begin-season-campaign-with-a-victory",
    source: "Indian Super League",
    published: "2026-10-11",
    kind: "News",
  },
];
export function relatedReading(
  m: Match,
  feed: MatchArticle[] = [],
  now = Date.now(),
): MatchArticle[] {
  const cutoff = Math.min(now, Date.parse(m.kickoff));
  const curated = CURATED.filter((a) =>
    a.teams.some((id) => [m.home.id, m.away.id].includes(id)),
  );
  return [
    ...new Map(
      [...curated, ...feed]
        .filter(
          (a) =>
            Date.parse(a.published) <= cutoff &&
            cutoff - Date.parse(a.published) < 45 * 864e5,
        )
        .map((a) => [a.url, a]),
    ).values(),
  ]
    .sort((a, b) => b.published.localeCompare(a.published))
    .slice(0, 6);
}
