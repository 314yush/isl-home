import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import type { Match } from "../lib/types";
import "./dom";
import { render, fireEvent, cleanup } from "@testing-library/react";
import MatchExplorer from "../components/MatchExplorer";
import FavouriteClub from "../components/FavouriteClub";
import ClubDirectory from "../components/ClubDirectory";
afterEach(() => {
  cleanup();
  localStorage.clear();
});
const matches: Match[] = [
  {
    id: "one",
    kickoff: "2026-10-20T14:00:00Z",
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
      id: "17997",
      name: "Kerala Blasters",
      shortName: "Kerala",
      abbr: "KBFC",
      score: null,
    },
  },
  {
    id: "two",
    kickoff: "2026-10-10T14:00:00Z",
    state: "post",
    statusText: "FT",
    home: {
      id: "18003",
      name: "FC Goa",
      shortName: "Goa",
      abbr: "FCG",
      score: 2,
    },
    away: {
      id: "18002",
      name: "Mumbai City",
      shortName: "Mumbai",
      abbr: "MCFC",
      score: 1,
    },
  },
];
test("supporters can combine filters and recover from no results", () => {
  const ui = render(<MatchExplorer matches={matches} />);
  assert.equal(ui.container.querySelectorAll('a[href^="/match/"]').length, 2);
  fireEvent.click(ui.getByRole("button", { name: "Results" }));
  assert.equal(
    ui.container.querySelector('a[href^="/match/"]')?.getAttribute("href"),
    "/match/two",
  );
  fireEvent.change(ui.getByRole("searchbox"), {
    target: { value: "Bengaluru" },
  });
  assert.ok(ui.getByText("No matches found"));
  fireEvent.click(ui.getByRole("button", { name: "Reset filters" }));
  assert.equal(ui.container.querySelectorAll('a[href^="/match/"]').length, 2);
  fireEvent.change(ui.getByLabelText("Club"), { target: { value: "17997" } });
  assert.equal(ui.container.querySelectorAll('a[href^="/match/"]').length, 1);
  assert.equal(
    ui.container.querySelector('a[href^="/match/"]')?.getAttribute("href"),
    "/match/one",
  );
});
test("a saved club persists after remount and can be removed", () => {
  let ui = render(<FavouriteClub matches={matches} />);
  fireEvent.click(ui.getByRole("button", { name: /Bengaluru FC/ }));
  assert.ok(ui.getByRole("heading", { name: "Next up" }));
  assert.equal(
    ui
      .getByRole("button", { name: /Bengaluru FC/ })
      .getAttribute("aria-pressed"),
    "true",
  );
  ui.unmount();
  ui = render(<FavouriteClub matches={matches} />);
  assert.ok(ui.getByRole("heading", { name: "Next up" }));
  assert.equal(
    ui.getByRole("link", { name: /Club hub/ }).getAttribute("href"),
    "/club/bengaluru-fc",
  );
  fireEvent.click(ui.getByRole("button", { name: "Remove favourite club" }));
  assert.equal(ui.queryByRole("heading", { name: "Next up" }), null);
});
test("club discovery searches cities and clears an empty search", () => {
  const ui = render(<ClubDirectory />);
  fireEvent.change(ui.getByRole("searchbox"), { target: { value: "Kolkata" } });
  assert.equal(ui.container.querySelectorAll('a[href^="/club/"]').length, 2);
  fireEvent.change(ui.getByRole("searchbox"), {
    target: { value: "no-such-city" },
  });
  assert.ok(ui.getByText("No clubs found"));
  fireEvent.click(ui.getByRole("button", { name: "Clear search" }));
  assert.equal(ui.container.querySelectorAll('a[href^="/club/"]').length, 13);
});
