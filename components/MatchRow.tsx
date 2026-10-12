import Link from "next/link";
import Badge from "./Badge";
import { ScorePill } from "./Ticker";
import { clubOr } from "@/lib/clubs";
import type { Match } from "@/lib/types";

export default function MatchRow({ m, short = false }: { m: Match; short?: boolean }) {
  const h = clubOr(m.home.id, m.home.name, m.home.abbr), a = clubOr(m.away.id, m.away.name, m.away.abbr);
  return (
    <Link href={`/match/${m.id}`} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 py-3 border-t border-[#ECEAF3] hover:bg-bg/60">
      <span className="flex items-center justify-end gap-2 text-sm font-semibold text-right">{short ? h.mono : h.name}<Badge id={m.home.id} size={26} /></span>
      <span className="flex flex-col items-center min-w-[64px]">
        <ScorePill m={m} big />
        {m.state === "in" && <span className="text-[10px] text-live font-bold mt-0.5">{m.statusText}</span>}
      </span>
      <span className="flex items-center gap-2 text-sm font-semibold"><Badge id={m.away.id} size={26} />{short ? a.mono : a.name}</span>
    </Link>
  );
}
