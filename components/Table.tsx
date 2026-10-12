import Link from "next/link";
import Badge from "./Badge";
import { clubOr } from "@/lib/clubs";
import type { StandingRow } from "@/lib/types";

const zone = (r: number, n: number) => (r <= 2 ? "#2F7CF6" : r <= 6 ? "#13B35B" : r === n ? "#E5004F" : "transparent");
export default function Table({ rows, compact = false, highlight, form }: { rows: StandingRow[]; compact?: boolean; highlight?: string; form?: Record<string, string[]> }) {
  const th = "py-2 px-1 text-[11px] text-mute font-semibold";
  return (
    <div>
      <table className="w-full border-collapse text-[13.5px] text-center">
        <thead><tr>
          <th className={th} /><th className={`${th} text-left`}>Club</th><th className={th}>Pl</th>
          {!compact && <><th className={th}>W</th><th className={th}>D</th><th className={th}>L</th><th className={`${th} hidden sm:table-cell`}>GF</th><th className={`${th} hidden sm:table-cell`}>GA</th></>}
          <th className={th}>GD</th><th className={th}>Pts</th>
          {!compact && form && <th className={`${th} hidden md:table-cell`}>Form</th>}
        </tr></thead>
        <tbody>
          {rows.map((r) => {
            const c = clubOr(r.team.id, r.team.name, r.team.abbr);
            return (
              <tr key={r.team.id} className={`border-t border-[#ECEAF3] ${highlight === r.team.id ? "bg-[#FFF1E8]" : ""}`}>
                <td className="py-2 px-1 font-bold" style={{ boxShadow: `inset 3px 0 0 ${zone(r.rank, rows.length)}` }}>{r.rank}</td>
                <td className="py-2 px-1 text-left">
                  <Link href={`/club/${c.slug}`} className="flex items-center gap-2 font-semibold hover:underline">
                    <Badge id={r.team.id} size={22} /><span>{compact ? c.mono : c.name}</span>
                  </Link>
                </td>
                <td>{r.played}</td>
                {!compact && <><td>{r.won}</td><td>{r.drawn}</td><td>{r.lost}</td><td className="hidden sm:table-cell">{r.gf}</td><td className="hidden sm:table-cell">{r.ga}</td></>}
                <td>{r.gd > 0 ? `+${r.gd}` : r.gd}</td><td className="font-bold">{r.points}</td>
                {!compact && form && <td className="hidden md:table-cell">{(form[r.team.id] ?? []).map((f, i) => (
                  <span key={i} className="inline-block w-4 h-4 rounded-full text-[9px] text-white font-bold leading-4 ml-0.5" style={{ background: f === "W" ? "#13B35B" : f === "D" ? "#9A98AE" : "#E5004F" }}>{f}</span>
                ))}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex gap-4 text-[11px] text-mute mt-3">
        <span><i className="inline-block w-2 h-2 bg-[#2F7CF6] mr-1" />Top 2</span><span><i className="inline-block w-2 h-2 bg-[#13B35B] mr-1" />Play-offs</span><span><i className="inline-block w-2 h-2 bg-live mr-1" />Bottom</span>
      </div>
    </div>
  );
}
