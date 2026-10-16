import { test } from "node:test";
import assert from "node:assert/strict";
import { espn } from "../lib/providers/espn";
const team = (id: string, name: string) => ({
  id,
  displayName: name,
  shortDisplayName: name,
  abbreviation: name.slice(0, 3),
});
const home = team("18851", "Bengaluru FC"),
  away = team("18000", "Chennaiyin FC");
const event = (
  id: string,
  date: string,
  homeScore: unknown,
  awayScore: unknown,
) => ({
  id,
  date,
  status: "post",
  statusType: { state: "post" },
  competitionName: "Indian Super League",
  competitors: [
    { homeAway: "home", team: away, score: homeScore },
    { homeAway: "away", team: home, score: awayScore },
  ],
});
test("match detail exposes prior meetings and form without reversing away scores", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        header: {
          id: "401925432",
          competitions: [
            {
              date: "2026-10-17T14:00:00Z",
              status: { type: { state: "pre" } },
              competitors: [
                { homeAway: "home", team: home },
                { homeAway: "away", team: away },
              ],
            },
          ],
        },
        seasonseries: [
          {
            type: "head-to-head",
            events: [
              event("old", "2026-05-16T11:30:00Z", "1", "2"),
              event("missing-score", "2025-01-01T12:00:00Z", null, "0"),
              event("future", "2027-01-01T12:00:00Z", "3", "0"),
            ],
          },
        ],
        lastFiveGames: [
          {
            team: home,
            events: [
              {
                id: "old",
                gameDate: "2026-05-16T11:30:00Z",
                homeTeamId: "18000",
                awayTeamId: "18851",
                homeTeamScore: "1",
                awayTeamScore: "2",
                opponent: away,
                competitionName: "Indian Super League",
              },
            ],
          },
        ],
      }),
    );
  try {
    const d = await espn.getMatchDetail("401925432");
    assert.equal(d?.preview?.meetings.length, 1);
    assert.equal(d?.preview?.meetings[0].away.score, 2);
    assert.equal(d?.preview?.form.home[0].home.id, "18000");
    assert.equal(d?.preview?.form.home[0].away.score, 2);
  } finally {
    globalThis.fetch = original;
  }
});

import { ticketFor } from "../lib/tickets";
import {
  formResult,
  relatedReading,
  summarizeMeetings,
} from "../lib/match-context";
import { parsePreview } from "../lib/providers/espnPreview";
import type { Match, HistoricalMatch } from "../lib/types";
const match: Match = {
  id: "401925432",
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
const now = Date.parse("2026-10-15T12:00:00Z");
test("tickets resolve the exact fixture and never reuse a listing after rescheduling or full time", () => {
  assert.equal(
    ticketFor(match, now)?.url,
    "https://www.district.in/events/isl-2026-27-bengaluru-fc-vs-chennaiyin-fc-buy-tickets",
  );
  assert.equal(ticketFor(match, now)?.direct, true);
  assert.equal(
    ticketFor({ ...match, kickoff: "2026-11-17T14:00:00Z" }, now)?.direct,
    false,
  );
  assert.equal(
    ticketFor({ ...match, home: match.away, away: match.home }, now)?.direct,
    false,
  );
  assert.equal(ticketFor({ ...match, state: "post" }, now), null);
  assert.equal(ticketFor(match, Date.parse("2026-10-18T00:00:00Z")), null);
  const search = ticketFor({ ...match, id: "unknown" }, now)!;
  assert.equal(
    new URL(search.url).searchParams.get("q"),
    "Bengaluru FC vs Chennaiyin FC",
  );
});
test("H2H counts wins from the current teams’ perspective and removes duplicate meetings", () => {
  const win: HistoricalMatch = {
    ...match,
    id: "older",
    kickoff: "2026-05-16T11:30:00Z",
    state: "post",
    home: { ...match.away, score: 1 },
    away: { ...match.home, score: 2 },
    competition: "Indian Super League",
  };
  const draw = {
    ...win,
    id: "draw",
    home: { ...win.home, score: 0 },
    away: { ...win.away, score: 0 },
  };
  const loss = {
    ...win,
    id: "loss",
    home: { ...win.home, score: 3 },
    away: { ...win.away, score: 0 },
  };
  assert.deepEqual(summarizeMeetings(match, [win, win, draw, loss]), {
    homeWins: 1,
    awayWins: 1,
    draws: 1,
    total: 3,
  });
  assert.equal(formResult(win, match.home.id), "W");
  assert.equal(formResult(win, match.away.id), "L");
});
test("news includes relevant recent headlines, not blanket league team tags or unsafe links", () => {
  const published = "2026-10-12T12:00:00Z";
  const article = (headline: string, url: string) => ({
    headline,
    published,
    links: { web: { href: url } },
    categories: [{ teamId: "18851" }],
  });
  const preview = parsePreview(
    {
      news: {
        articles: [
          article(
            "Bengaluru prepare for the derby",
            "https://www.espn.com/story/relevant",
          ),
          article("Punjab beat Odisha", "https://www.espn.com/story/unrelated"),
          article("Chennaiyin news", "javascript:alert(1)"),
        ],
      },
    },
    match,
  );
  assert.equal(preview.news.length, 1);
  assert.equal(preview.news[0].title, "Bengaluru prepare for the derby");
  assert.ok(
    relatedReading(match, [], now).some((n) => n.source === "Chennaiyin FC"),
  );
  assert.equal(
    relatedReading(
      { ...match, kickoff: "2027-05-01T12:00:00Z" },
      [],
      Date.parse("2027-04-30T12:00:00Z"),
    ).length,
    0,
  );
});
