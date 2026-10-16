import type {
  Match,
  MatchPreview,
  HistoricalMatch,
  TeamRef,
  MatchArticle,
} from "../types";

type Row = Record<string, unknown>;
const object = (value: unknown): Row =>
  value && typeof value === "object" ? (value as Row) : {};
const list = (value: unknown): Row[] =>
  Array.isArray(value) ? value.map(object) : [];
const str = (value: unknown) =>
  typeof value === "string" || typeof value === "number" ? String(value) : "";
const score = (value: unknown) => {
  const s = str(value);
  const n = Number(s);
  return s.trim() && Number.isInteger(n) && n >= 0 ? n : null;
};
function team(value: unknown): TeamRef | null {
  const t = object(value),
    id = str(t.id),
    name = str(t.displayName ?? t.name);
  return id && name
    ? {
        id,
        name,
        shortName: str(t.shortDisplayName) || name,
        abbr: str(t.abbreviation) || name.slice(0, 3),
      }
    : null;
}
function validHistory(m: HistoricalMatch, current: Match) {
  return (
    m.id !== current.id &&
    m.home.score !== null &&
    m.away.score !== null &&
    Number.isFinite(Date.parse(m.kickoff)) &&
    Date.parse(m.kickoff) < Date.parse(current.kickoff)
  );
}
function recent(matches: HistoricalMatch[]) {
  return [...new Map(matches.map((m) => [m.id, m])).values()]
    .sort((a, b) => b.kickoff.localeCompare(a.kickoff))
    .slice(0, 5);
}
function safeUrl(value: unknown) {
  try {
    const u = new URL(str(value));
    return u.protocol === "https:" ? u.href : null;
  } catch {
    return null;
  }
}

/** Optional summary sections must never prevent the core match from rendering. */
export function parsePreview(raw: unknown, current: Match): MatchPreview {
  const data = object(raw);
  const meetings: HistoricalMatch[] = [];
  for (const series of list(data.seasonseries).filter(
    (s) => s.type === "head-to-head",
  ))
    for (const e of list(series.events)) {
      if (e.status !== "post" && object(e.statusType).state !== "post")
        continue;
      const competitors = list(e.competitors),
        h = competitors.find((c) => c.homeAway === "home"),
        a = competitors.find((c) => c.homeAway === "away");
      const ht = team(h?.team),
        at = team(a?.team);
      if (!ht || !at) continue;
      if (
        ![ht.id, at.id].includes(current.home.id) ||
        ![ht.id, at.id].includes(current.away.id)
      )
        continue;
      const m: HistoricalMatch = {
        id: str(e.id),
        kickoff: str(e.date),
        state: "post",
        statusText: "FT",
        home: { ...ht, score: score(h?.score) },
        away: { ...at, score: score(a?.score) },
        competition: str(e.competitionName) || "Competition not supplied",
      };
      if (m.id && validHistory(m, current)) meetings.push(m);
    }
  const form: { home: HistoricalMatch[]; away: HistoricalMatch[] } = {
    home: [],
    away: [],
  };
  for (const group of list(data.lastFiveGames)) {
    const t = team(group.team);
    if (!t) continue;
    const side =
      t.id === current.home.id
        ? "home"
        : t.id === current.away.id
          ? "away"
          : null;
    if (!side) continue;
    for (const e of list(group.events)) {
      const opponent = team(e.opponent);
      if (!opponent) continue;
      const homeId = str(e.homeTeamId),
        awayId = str(e.awayTeamId);
      if (
        ![homeId, awayId].includes(t.id) ||
        ![homeId, awayId].includes(opponent.id)
      )
        continue;
      const m: HistoricalMatch = {
        id: str(e.id),
        kickoff: str(e.gameDate),
        state: "post",
        statusText: "FT",
        home: {
          ...(homeId === t.id ? t : opponent),
          score: score(e.homeTeamScore),
        },
        away: {
          ...(awayId === t.id ? t : opponent),
          score: score(e.awayTeamScore),
        },
        competition:
          str(e.competitionName) ||
          str(e.leagueName) ||
          "Competition not supplied",
      };
      if (m.id && validHistory(m, current)) form[side].push(m);
    }
    form[side] = recent(form[side]);
  }
  // League articles are often tagged with every team, so match actual headline names.
  const aliases = [current.home, current.away]
    .flatMap((t) =>
      [t.name, t.shortName].map((n) =>
        n
          .toLowerCase()
          .replace(/\b(fc|sg|super giant)\b/g, "")
          .trim(),
      ),
    )
    .filter((n) => n.length > 3);
  const news: MatchArticle[] = [];
  for (const a of list(object(data.news).articles)) {
    const title = str(a.headline),
      published = str(a.published),
      url = safeUrl(object(object(a.links).web).href);
    if (
      !url ||
      !title ||
      !published ||
      !aliases.some((n) => title.toLowerCase().includes(n))
    )
      continue;
    const date = Date.parse(published),
      cutoff = Math.min(Date.now(), Date.parse(current.kickoff));
    if (!Number.isFinite(date) || date > cutoff || cutoff - date > 45 * 864e5)
      continue;
    news.push({ title, url, published, source: "ESPN", kind: "News" });
  }
  return {
    meetings: recent(meetings),
    form,
    news: news
      .sort((a, b) => b.published.localeCompare(a.published))
      .slice(0, 4),
  };
}
