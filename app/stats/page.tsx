import Link from "next/link";
import { getStandings } from "@/lib/data";
import { clubOr } from "@/lib/clubs";
import AutoRefresh from "@/components/AutoRefresh";
import Badge from "@/components/Badge";
import PageBanner from "@/components/PageBanner";
import StaleBanner from "@/components/StaleBanner";
import type { StandingRow } from "@/lib/types";
export const dynamic = "force-dynamic";
export const metadata = { title: "Club statistics" };
export default async function Stats() {
  const { rows, meta } = await getStandings();
  const played = rows.reduce((n, r) => n + r.played, 0) / 2;
  const goals = rows.reduce((n, r) => n + r.gf, 0);
  const boards: {
    title: string;
    label: string;
    key: keyof Pick<StandingRow, "gf" | "won" | "gd" | "ga">;
    ascending?: boolean;
  }[] = [
    { title: "Goals scored", label: "The attacking edge", key: "gf" },
    { title: "Most wins", label: "Making it count", key: "won" },
    { title: "Goal difference", label: "Finding the balance", key: "gd" },
    {
      title: "Fewest conceded",
      label: "Holding the line",
      key: "ga",
      ascending: true,
    },
  ];
  return (
    <>
      <AutoRefresh seconds={60} label={false} />
      <PageBanner
        eyebrow="The numbers behind the game"
        title="A season in stats."
        description="Explore the clubs setting the pace. Team statistics calculated from the current league table."
      />
      <StaleBanner meta={meta} empty={!rows.length} />
      <main className="shell py-10">
        {rows.length > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-3 mb-10">
              {[
                [String(played), "Matches played"],
                [String(goals), "Goals scored"],
                [played ? (goals / played).toFixed(2) : "—", "Goals per match"],
              ].map(([v, l]) => (
                <div key={l} className="bg-[#e9ede6] p-5 md:p-8">
                  <p className="d text-[44px] md:text-[70px]">{v}</p>
                  <p className="eyebrow text-mute mt-3">{l}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {boards.map((b) => (
                <section
                  key={b.key}
                  className="bg-white border border-line p-6 md:p-8"
                >
                  <p className="eyebrow text-mute mb-3">{b.label}</p>
                  <h2 className="d text-4xl mb-6">{b.title}</h2>
                  {[...rows]
                    .filter((r) => r.played > 0)
                    .sort(
                      (a, c) =>
                        (b.ascending ? 1 : -1) * (a[b.key] - c[b.key]) ||
                        a.rank - c.rank,
                    )
                    .slice(0, 5)
                    .map((r, i) => {
                      const c = clubOr(r.team.id, r.team.name, r.team.abbr);
                      return (
                        <Link
                          key={c.id}
                          href={`/club/${c.slug}`}
                          className="flex items-center gap-4 border-t border-line py-4 hover:text-[#b94322]"
                        >
                          <span className="text-xs text-mute w-3">{i + 1}</span>
                          <Badge id={c.id} size={30} />
                          <span className="font-semibold text-sm flex-1">
                            {c.name}
                          </span>
                          <b className="font-display text-3xl">{r[b.key]}</b>
                        </Link>
                      );
                    })}
                </section>
              ))}
            </div>
            <p className="text-xs text-mute mt-6">
              Totals reflect teams and matches in the standings feed. Clubs may
              have played different numbers of matches.
            </p>
          </>
        ) : (
          <div className="empty-state">
            <h2>Stats are on their way</h2>
            <p className="text-mute">
              Club statistics will appear when the standings feed is available.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
