import Link from "next/link";
import Badge from "./Badge";
import { fmtDay, fmtTime } from "@/lib/time";
import type { Match } from "@/lib/types";
import { clubOr } from "@/lib/clubs";

export function ScorePill({ m, big = false }: { m: Match; big?: boolean }) {
  if (m.state === "pre") return <span className={`text-ind font-bold border border-line rounded px-2 ${big ? "py-1 text-sm" : "text-xs"}`}>{fmtTime(m.kickoff)}</span>;
  if (m.state === "postponed") return <span className="text-xs font-bold text-mute">PPD</span>;
  return <span className={`d text-white rounded ${m.state === "in" ? "bg-live" : "bg-ind"} ${big ? "text-2xl px-3 py-1" : "text-xl px-2 py-0.5"}`}>{m.home.score}-{m.away.score}</span>;
}

export default function Ticker({ matches }: { matches: Match[] }) {
  return (
    <div className="bg-white h-[62px] flex items-stretch border-b border-line">
      <div className="d bg-org text-ind hidden md:flex items-center px-5 text-xl flex-none">Scores</div>
      <div className="flex overflow-x-auto noscroll flex-1">
        {matches.length === 0 && <div className="px-4 flex items-center text-sm text-mute">No fixtures available right now.</div>}
        {matches.map((m) => (
          <Link key={m.id} href={`/match/${m.id}`} className="flex items-center gap-2 px-4 border-r border-line flex-none hover:bg-bg">
            <div className="flex flex-col gap-1">
              {m.state === "in" ? <span className="live w-fit">{m.statusText}</span> : <span className="text-[10px] font-semibold text-mute uppercase">{m.state === "post" ? `FT · ${fmtDay(m.kickoff)}` : fmtDay(m.kickoff)}</span>}
              <span className="flex items-center gap-1.5">
                <b className="text-[13px]">{clubOr(m.home.id, m.home.name, m.home.abbr).mono}</b><Badge id={m.home.id} size={22} />
                <ScorePill m={m} />
                <Badge id={m.away.id} size={22} /><b className="text-[13px]">{clubOr(m.away.id, m.away.name, m.away.abbr).mono}</b>
              </span>
            </div>
          </Link>
        ))}
      </div>
      <Link href="/matches" className="hidden md:flex items-center px-5 text-sm font-bold text-ind flex-none">All fixtures →</Link>
    </div>
  );
}
