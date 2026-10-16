import { test } from "node:test";
import assert from "node:assert/strict";
import { cached } from "../lib/cache";
import { espn } from "../lib/providers/espn";

test("a legitimate empty scoreboard replaces old matches", async () => {
  await cached("test-empty", 0, async () => [1]);
  const result = await cached("test-empty", 0, async () => []);
  assert.deepEqual(result.data, []);
  assert.equal(result.stale, false);
});
test("a failed refresh retains the last successful data", async () => {
  await cached("test-fallback", 0, async () => [1]);
  const result = await cached("test-fallback", 0, async () => {
    throw new Error("offline");
  });
  assert.deepEqual(result.data, [1]);
  assert.equal(result.stale, true);
});
test("partial schedule failures reject rather than publishing an incomplete season", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (input) => {
    if (String(input).includes("dates=")) throw new Error("offline");
    return new Response(
      JSON.stringify({
        leagues: [{ calendar: ["2026-10-15"] }],
        events: [
          {
            id: "1",
            date: "2026-10-15T14:00:00Z",
            competitions: [
              {
                status: { type: { state: "pre" } },
                competitors: [
                  {
                    homeAway: "home",
                    team: { id: "a", displayName: "A", abbreviation: "A" },
                  },
                  {
                    homeAway: "away",
                    team: { id: "b", displayName: "B", abbreviation: "B" },
                  },
                ],
              },
            ],
          },
        ],
      }),
    );
  };
  try {
    await assert.rejects(() => espn.getFixtures(), /offline/);
  } finally {
    globalThis.fetch = original;
  }
});

test("invalid empty core responses are marked stale even on a cold cache", async () => {
  const result = await cached(
    "test-core-empty",
    0,
    async () => [],
    (d) => d.length === 0,
  );
  assert.equal(result.stale, true);
  assert.equal(result.data, null);
});
