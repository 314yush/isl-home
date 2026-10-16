import Link from "next/link";
import Badge from "./Badge";
import { clubOr } from "@/lib/clubs";
import type { StandingRow } from "@/lib/types";
export default function Table({
  rows,
  compact = false,
  highlight,
  form,
}: {
  rows: StandingRow[];
  compact?: boolean;
  highlight?: string;
  form?: Record<string, string[]>;
}) {
  return (
    <div className="overflow-x-auto">
      <table
        className={`league-table w-full border-collapse ${compact ? "compact" : ""}`}
      >
        <caption className="sr-only">
          League standings. P: played, W: won, D: drawn, L: lost, GF: goals for,
          GA: goals against, GD: goal difference, Pts: points.
        </caption>
        <thead>
          <tr>
            <th scope="col">Pos</th>
            <th scope="col" className="!text-left">
              Club
            </th>
            <th scope="col">P</th>
            {!compact && (
              <>
                <th scope="col" className="hidden sm:table-cell">
                  W
                </th>
                <th scope="col" className="hidden sm:table-cell">
                  D
                </th>
                <th scope="col" className="hidden sm:table-cell">
                  L
                </th>
                <th scope="col" className="hidden md:table-cell">
                  GF
                </th>
                <th scope="col" className="hidden md:table-cell">
                  GA
                </th>
              </>
            )}
            <th scope="col">GD</th>
            <th scope="col">Pts</th>
            {!compact && form && (
              <th scope="col" className="hidden lg:table-cell">
                Last 5
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const c = clubOr(r.team.id, r.team.name, r.team.abbr);
            return (
              <tr
                key={r.team.id}
                className={highlight === r.team.id ? "bg-mint/40" : ""}
              >
                <td className="font-semibold">{r.rank}</td>
                <td className="club-cell">
                  <Link
                    href={`/club/${c.slug}`}
                    className="inline-flex items-center gap-2 md:gap-3 font-semibold hover:underline"
                  >
                    <Badge id={r.team.id} size={compact ? 24 : 30} />
                    <span>
                      {compact ? (
                        c.short
                      ) : (
                        <>
                          <span className="hidden sm:inline">{c.name}</span>
                          <span className="sm:hidden">{c.mono}</span>
                        </>
                      )}
                    </span>
                  </Link>
                </td>
                <td>{r.played}</td>
                {!compact && (
                  <>
                    <td className="hidden sm:table-cell">{r.won}</td>
                    <td className="hidden sm:table-cell">{r.drawn}</td>
                    <td className="hidden sm:table-cell">{r.lost}</td>
                    <td className="hidden md:table-cell">{r.gf}</td>
                    <td className="hidden md:table-cell">{r.ga}</td>
                  </>
                )}
                <td>{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
                <td className="font-bold !text-base">{r.points}</td>
                {!compact && form && (
                  <td className="hidden lg:table-cell">
                    <div className="flex gap-1 justify-center">
                      {(form[r.team.id] ?? []).map((f, i) => (
                        <span
                          key={i}
                          title={
                            f === "W" ? "Win" : f === "D" ? "Draw" : "Loss"
                          }
                          className={`w-5 h-5 text-[10px] leading-5 text-white ${f === "W" ? "bg-[#367851]" : f === "D" ? "bg-[#78868a]" : "bg-[#c04636]"}`}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
