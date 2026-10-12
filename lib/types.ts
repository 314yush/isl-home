export type MatchState = "pre" | "in" | "post" | "postponed";

export interface TeamRef {
  id: string;
  name: string;
  shortName: string;
  abbr: string;
}

export interface Match {
  id: string;
  kickoff: string; // ISO UTC
  state: MatchState;
  statusText: string; // "FT", "67'", "HT", ...
  clock?: string;
  home: TeamRef & { score: number | null; winner?: boolean };
  away: TeamRef & { score: number | null; winner?: boolean };
  venue?: string;
  city?: string;
}

export interface StandingRow {
  rank: number;
  team: TeamRef;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

export type EventKind = "goal" | "own-goal" | "penalty" | "yellow" | "red" | "sub" | "other";
export interface MatchEvent {
  minute: string;
  kind: EventKind;
  teamId: string;
  player: string;
  detail?: string;
}

export interface LineupPlayer {
  name: string;
  shortName: string;
  number: string;
  position: string; // e.g. LB, CD-L, F, SUB
  starter: boolean;
  subbedIn?: boolean;
  subbedOut?: boolean;
}

export interface TeamStat {
  key: string;
  label: string;
  home: number;
  away: number;
  homeDisplay: string;
  awayDisplay: string;
}

export interface MatchDetail {
  match: Match;
  events: MatchEvent[];
  stats: TeamStat[];
  lineups: { home: { formation?: string; players: LineupPlayer[] }; away: { formation?: string; players: LineupPlayer[] } } | null;
  attendance?: number;
}

export interface SquadPlayer {
  id: string;
  name: string;
  number?: string;
  position: string; // Goalkeeper / Defender / ...
  age?: number;
  nationality?: string;
}

export type Team = TeamRef;

/** Normalized provider interface. Implement this to swap data vendors. */
export interface FootballProvider {
  name: string;
  attribution: string;
  /** Full season fixtures + results. */
  getFixtures(): Promise<Match[]>;
  /** Today's / current live scoreboard. */
  getLiveScores(): Promise<Match[]>;
  getStandings(): Promise<StandingRow[]>;
  getMatchDetail(id: string): Promise<MatchDetail | null>;
  getTeams(): Promise<Team[]>;
  getSquad(teamId: string): Promise<SquadPlayer[]>;
}
