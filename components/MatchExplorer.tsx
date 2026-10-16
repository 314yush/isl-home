"use client";
import { ticketFor } from "@/lib/tickets";
import { useState } from "react";
import Link from "next/link";
import { CLUBS, clubOr } from "@/lib/clubs";
import { fmtDayLong, fmtTime, istDate } from "@/lib/time";
import type { Match } from "@/lib/types";
import Badge from "./Badge";
export default function MatchExplorer({
  matches,
  initialClub = "",
}: {
  matches: Match[];
  initialClub?: string;
}) {
  const [tab, setTab] = useState("all"),
    [club, setClub] = useState(initialClub),
    [query, setQuery] = useState(""),
    [month, setMonth] = useState("");
  const months = [
    ...new Set(matches.map((m) => istDate(m.kickoff).slice(0, 7))),
  ];
  const filtered = matches.filter(
    (m) =>
      (!club || m.home.id === club || m.away.id === club) &&
      (!month || istDate(m.kickoff).startsWith(month)) &&
      (tab === "all" ||
        (tab === "results"
          ? m.state === "post"
          : tab === "live"
            ? m.state === "in"
            : m.state === "pre" || m.state === "postponed")) &&
      `${m.home.name} ${m.away.name} ${m.venue ?? ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  // Show the next matches before past results; results themselves are newest first.
  const sorted = [...filtered].sort((a, b) => {
    const ap = a.state === "post",
      bp = b.state === "post";
    if (ap !== bp) return ap ? 1 : -1;
    return ap
      ? b.kickoff.localeCompare(a.kickoff)
      : a.kickoff.localeCompare(b.kickoff);
  });
  const groups = new Map<string, Match[]>();
  for (const m of sorted) {
    const key = `${istDate(m.kickoff)}-${m.state === "post" ? "results" : "fixtures"}`;
    groups.set(key, [...(groups.get(key) ?? []), m]);
  }
  return (
    <div>
      <div
        className="flex overflow-x-auto border-b border-line mb-6"
        aria-label="Match status"
      >
        {[
          ["all", "All matches"],
          ["upcoming", "Upcoming"],
          ["results", "Results"],
          ["live", "Live now"],
        ].map(([v, l]) => (
          <button
            key={v}
            className="tab-button"
            aria-pressed={tab === v}
            onClick={() => setTab(v)}
          >
            {l}
            {v === "live" && (
              <span className="ml-2 text-[10px] bg-line rounded-full px-1.5 py-0.5">
                {matches.filter((m) => m.state === "in").length}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <label className="filter-label">
          Club
          <select
            className="filter"
            value={club}
            onChange={(e) => setClub(e.target.value)}
          >
            <option value="">All clubs</option>
            {CLUBS.map((c) => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-label">
          Month
          <select
            className="filter"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">All dates</option>
            {months.map((m) => (
              <option value={m} key={m}>
                {new Intl.DateTimeFormat("en-IN", {
                  month: "long",
                  year: "numeric",
                  timeZone: "Asia/Kolkata",
                }).format(new Date(`${m}-01T00:00:00Z`))}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-label">
          Find a match
          <input
            type="search"
            placeholder="Club or stadium…"
            className="filter normal-case tracking-normal"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <p className="text-xs text-mute mb-4" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "match" : "matches"} · All
        kick-offs in IST
      </p>
      {!filtered.length && (
        <div className="empty-state">
          <h2>
            {tab === "live" ? "No matches live right now" : "No matches found"}
          </h2>
          <p className="text-mute text-sm mb-5">
            {matches.length
              ? "Try another club, date or match status."
              : "Fixtures will appear here when the feed is available."}
          </p>
          {matches.length > 0 && (
            <button
              className="btn btn-dark"
              onClick={() => {
                setClub("");
                setMonth("");
                setQuery("");
                setTab("all");
              }}
            >
              Reset filters
            </button>
          )}
        </div>
      )}
      <div className="grid gap-6">
        {[...groups].map(([date, ms]) => (
          <section key={date} className="bg-white border border-line">
            <h2 className="px-6 py-4 bg-[#e9ede6] font-semibold text-sm">
              {fmtDayLong(ms[0].kickoff)}
            </h2>
            {ms.map((m) => {
              const h = clubOr(m.home.id, m.home.name, m.home.abbr),
                a = clubOr(m.away.id, m.away.name, m.away.abbr);
              const ticket = ticketFor(m);
              return (
                <div key={m.id}>
                  <Link href={`/match/${m.id}`} className="block">
                    <div className="match-list-row">
                      <div className="flex items-center justify-end gap-3 min-w-0">
                        <span className="font-semibold text-sm text-right hidden sm:block">
                          {h.name}
                        </span>
                        <span className="font-semibold text-sm sm:hidden">
                          {h.mono}
                        </span>
                        <Badge id={m.home.id} size={34} />
                      </div>
                      <div className="text-center">
                        {m.state === "in" && (
                          <span className="live mb-1">{m.statusText}</span>
                        )}
                        <span
                          className={`block py-2 font-display font-semibold text-xl ${m.state === "pre" ? "border border-line" : "bg-ind text-white"}`}
                        >
                          {m.state === "pre"
                            ? fmtTime(m.kickoff)
                            : m.state === "postponed"
                              ? "PPD"
                              : `${m.home.score ?? "–"} – ${m.away.score ?? "–"}`}
                        </span>
                        {m.state === "post" && (
                          <span className="text-[9px] text-mute">
                            FULL TIME
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 min-w-0">
                        <Badge id={m.away.id} size={34} />
                        <span className="font-semibold text-sm hidden sm:block">
                          {a.name}
                        </span>
                        <span className="font-semibold text-sm sm:hidden">
                          {a.mono}
                        </span>
                      </div>
                    </div>
                    <p className="text-center text-[11px] text-mute pb-4 -mt-2">
                      {m.venue ?? "Venue to be confirmed"}{" "}
                      <span className="mx-2">·</span> Match centre →
                    </p>
                  </Link>
                  {ticket && (
                    <div className="text-center pb-4">
                      <a
                        href={ticket.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex px-4 py-2 border border-line text-xs font-semibold hover:bg-ind hover:text-white"
                      >
                        {ticket.label} ↗
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}
