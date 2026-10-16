import type { Match, MatchDetail } from "./types";
export type MatchSection = "events" | "stats" | "lineups" | "context" | "news";

export function matchSectionOrder(
  match: Match,
  lineups: MatchDetail["lineups"],
  now = Date.now(),
): MatchSection[] {
  if (match.state === "in" || match.state === "post") {
    return ["events", "stats", "lineups", "context", "news"];
  }
  const startersAnnounced = [lineups?.home, lineups?.away].some((side) =>
    side?.players.some((player) => player.starter),
  );
  const nearKickoff = new Date(match.kickoff).getTime() <= now + 60 * 60 * 1000;
  if (match.state === "pre" && (startersAnnounced || nearKickoff)) {
    return ["lineups", "events", "stats", "context", "news"];
  }
  return ["context", "events", "stats", "lineups", "news"];
}
