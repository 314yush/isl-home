import { ticketFor } from "@/lib/tickets";
import Link from "next/link";
import Badge from "./Badge";
import Icon from "./Icon";
import { fmtDay, fmtTime } from "@/lib/time";
import { clubOr } from "@/lib/clubs";
import type { Match } from "@/lib/types";
export default function MatchCard({ match: m }: { match: Match }) {
  const h = clubOr(m.home.id, m.home.name, m.home.abbr),
    a = clubOr(m.away.id, m.away.name, m.away.abbr);
  const ticket = ticketFor(m);
  return (
    <div className="bg-white border border-line">
      <Link href={`/match/${m.id}`} className="block p-5 hover:bg-bg group">
        <div className="flex justify-between items-center mb-5">
          <span className="eyebrow text-mute">{fmtDay(m.kickoff)}</span>
          {m.state === "in" ? (
            <span className="live">Live {m.statusText}</span>
          ) : (
            <span className="text-[10px] text-mute">
              {m.state === "post"
                ? "FULL TIME"
                : m.state === "postponed"
                  ? "POSTPONED"
                  : `${fmtTime(m.kickoff)} IST`}
            </span>
          )}
        </div>
        {[
          { team: m.home, club: h },
          { team: m.away, club: a },
        ].map(({ team, club }) => (
          <div key={team.id} className="flex items-center gap-3 my-3">
            <Badge id={team.id} size={27} />
            <span className="font-semibold text-sm">{club.name}</span>
            <span className="ml-auto font-display text-[25px] font-semibold">
              {m.state === "pre" || m.state === "postponed"
                ? "–"
                : (team.score ?? "–")}
            </span>
          </div>
        ))}
        <div className="border-t border-line pt-3 mt-4 flex justify-between items-center text-xs text-mute">
          <span className="truncate mr-3">{m.venue ?? "Match centre"}</span>
          <Icon name="arrow" size={16} />
        </div>
      </Link>
      {ticket && (
        <a
          href={ticket.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-between items-center border-t border-line px-5 py-3 text-xs font-semibold hover:bg-ind hover:text-white"
        >
          {ticket.label} <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  );
}
