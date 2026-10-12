/**
 * API-Football (api-sports.io) adapter STUB. League 323 = Indian Super League.
 * Requires API_FOOTBALL_KEY (Pro plan $19/mo for the current season).
 * Implement the TODOs and set DATA_PROVIDER=api-football to switch.
 */
import type { FootballProvider } from "../types";

const BASE = "https://v3.football.api-sports.io";
const LEAGUE = 323;
const SEASON = Number(process.env.API_FOOTBALL_SEASON ?? 2026);

async function get(path: string) {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) throw new Error("API_FOOTBALL_KEY not set");
  const r = await fetch(`${BASE}${path}`, { headers: { "x-apisports-key": key }, cache: "no-store" });
  if (!r.ok) throw new Error(`API-Football ${r.status}`);
  return r.json();
}

const todo = (what: string) => async (): Promise<never> => { throw new Error(`apiFootball.${what} not implemented yet`); };

export const apiFootball: FootballProvider = {
  name: "api-football",
  attribution: "API-Football",
  // TODO: GET /fixtures?league=323&season=SEASON  → map response[] to Match
  getFixtures: todo("getFixtures"),
  // TODO: GET /fixtures?league=323&live=all
  getLiveScores: todo("getLiveScores"),
  // TODO: GET /standings?league=323&season=SEASON
  getStandings: todo("getStandings"),
  // TODO: /fixtures?id=  + /fixtures/events + /fixtures/lineups + /fixtures/statistics
  getMatchDetail: todo("getMatchDetail"),
  // TODO: GET /teams?league=323&season=SEASON
  getTeams: todo("getTeams"),
  // TODO: GET /players/squads?team=
  getSquad: todo("getSquad"),
};
void get; void LEAGUE; void SEASON;
