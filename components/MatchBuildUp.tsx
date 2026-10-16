import Link from "next/link";
import type {
  HistoricalMatch,
  Match,
  MatchPreview,
  StandingRow,
} from "@/lib/types";
import { clubOr } from "@/lib/clubs";
import { formResult, summarizeMeetings } from "@/lib/match-context";
import Badge from "./Badge";

const dateLabel = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));

function TeamForm({
  team,
  results,
  standing,
}: {
  team: Match["home"];
  results: HistoricalMatch[];
  standing?: StandingRow;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-1.5">
      <Badge id={team.id} size={24} />
      <span className="text-xs font-semibold mr-auto">
        {team.shortName}
        {standing && (
          <span className="text-mute font-normal ml-2">
            #{standing.rank} · {standing.points} pts
          </span>
        )}
      </span>
      <div
        className="flex gap-1"
        aria-label={`${team.name} form, oldest to newest`}
      >
        {[...results].reverse().map((result) => {
          const outcome = formResult(result, team.id);
          const label = `${dateLabel(result.kickoff)}: ${result.home.name} ${result.home.score}–${result.away.score} ${result.away.name}`;
          return (
            <Link
              key={result.id}
              href={`/match/${result.id}`}
              title={label}
              aria-label={`${outcome}: ${label}`}
              className={`w-6 h-6 flex items-center justify-center text-white text-[10px] font-bold ${outcome === "W" ? "bg-[#367851]" : outcome === "D" ? "bg-[#78868a]" : "bg-[#c04636]"}`}
            >
              {outcome}
            </Link>
          );
        })}
        {!results.length && (
          <span className="text-xs text-mute">Form unavailable</span>
        )}
      </div>
    </div>
  );
}

export default function MatchBuildUp({
  match: m,
  preview,
  standings,
  standingsStale = false,
}: {
  match: Match;
  preview?: MatchPreview;
  standings: StandingRow[];
  standingsStale?: boolean;
}) {
  const h = clubOr(m.home.id, m.home.name, m.home.abbr),
    a = clubOr(m.away.id, m.away.name, m.away.abbr);
  const meetings = preview?.meetings ?? [],
    summary = summarizeMeetings(m, meetings);
  return (
    <section
      className="lg:col-span-2 border border-line bg-white px-5 py-4"
      aria-labelledby="context"
    >
      <h2 id="context" className="d text-[24px] mb-3">
        Head to head &amp; form
      </h2>
      <div className="grid md:grid-cols-2 gap-4 md:gap-8">
        <div>
          {summary.total ? (
            <>
              <div className="flex items-baseline justify-between gap-3 text-xs">
                <span>
                  {h.short}{" "}
                  <b className="font-display text-2xl ml-1">
                    {summary.homeWins}
                  </b>
                </span>
                <span className="text-mute">
                  Draws{" "}
                  <b className="font-display text-2xl ml-1">{summary.draws}</b>
                </span>
                <span>
                  {a.short}{" "}
                  <b className="font-display text-2xl ml-1">
                    {summary.awayWins}
                  </b>
                </span>
              </div>
              <details className="mt-2 text-xs">
                <summary className="cursor-pointer text-mute hover:text-ind">
                  Previous meetings · Last {summary.total} supplied
                </summary>
                <p className="text-[10px] text-mute mt-3">
                  ESPN · Recent meetings, not an all-time record
                </p>
                {meetings.map((result) => (
                  <Link
                    key={result.id}
                    href={`/match/${result.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-line hover:text-org"
                  >
                    <span className="text-mute text-[10px]">
                      {dateLabel(result.kickoff)} · {result.competition}
                    </span>
                    <span>
                      {result.home.shortName}{" "}
                      <b>
                        {result.home.score}–{result.away.score}
                      </b>{" "}
                      {result.away.shortName}
                    </span>
                  </Link>
                ))}
              </details>
            </>
          ) : (
            <p className="text-xs text-mute">
              Previous meetings haven’t been supplied for this fixture.
            </p>
          )}
        </div>
        <div className="md:border-l border-line md:pl-8">
          <TeamForm
            team={m.home}
            results={preview?.form.home ?? []}
            standing={standings.find((r) => r.team.id === m.home.id)}
          />
          <TeamForm
            team={m.away}
            results={preview?.form.away ?? []}
            standing={standings.find((r) => r.team.id === m.away.id)}
          />
          <p className="text-[10px] text-mute mt-1">
            ESPN · Last 5 available · Oldest → newest
            {standingsStale ? " · Standings update delayed" : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
