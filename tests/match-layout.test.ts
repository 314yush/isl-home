import { test } from "node:test";
import assert from "node:assert/strict";
import { matchSectionOrder } from "../lib/match-layout";
import type { Match, MatchDetail } from "../lib/types";
const match: Match = {
  id: "fixture",
  kickoff: "2026-10-17T14:00:00Z",
  state: "pre",
  statusText: "",
  home: {
    id: "18851",
    name: "Bengaluru FC",
    shortName: "Bengaluru",
    abbr: "BFC",
    score: null,
  },
  away: {
    id: "18000",
    name: "Chennaiyin FC",
    shortName: "Chennaiyin",
    abbr: "CFC",
    score: null,
  },
};
const player = {
  name: "Player",
  shortName: "Player",
  number: "1",
  position: "G",
  starter: true,
};
const lineups: NonNullable<MatchDetail["lineups"]> = {
  home: { players: [player] },
  away: { players: [player] },
};
test("announced starters make lineups primary even well before kickoff", () => {
  assert.deepEqual(
    matchSectionOrder(match, lineups, Date.parse("2026-10-17T10:00:00Z")),
    ["lineups", "events", "stats", "context", "news"],
  );
});
test("the matchday layout begins an hour before kickoff, without requiring lineups", () => {
  assert.equal(
    matchSectionOrder(match, null, Date.parse("2026-10-17T12:59:59Z"))[0],
    "context",
  );
  assert.equal(
    matchSectionOrder(match, null, Date.parse("2026-10-17T13:00:00Z"))[0],
    "lineups",
  );
});
test("live and completed matches lead with events and stats, with news always last", () => {
  for (const state of ["in", "post"] as const)
    assert.deepEqual(matchSectionOrder({ ...match, state }, lineups), [
      "events",
      "stats",
      "lineups",
      "context",
      "news",
    ]);
});
test("empty or bench-only roster data does not announce a starting lineup", () => {
  const empty = {
    home: { players: [] },
    away: { players: [{ ...player, starter: false }] },
  };
  const order = matchSectionOrder(
    match,
    empty,
    Date.parse("2026-10-16T13:00:00Z"),
  );
  assert.equal(order[0], "context");
  assert.equal(order.at(-1), "news");
});
