import { getAllMatches, getStandings } from "@/lib/data";
import Table from "@/components/Table";
import PageBanner from "@/components/PageBanner";
import StaleBanner from "@/components/StaleBanner";
import AutoRefresh from "@/components/AutoRefresh";
import Link from "next/link";
export const dynamic = "force-dynamic";
export const metadata = { title: "League table" };
export default async function TablePage() {
  const [{ rows, meta }, { matches, meta: mm }] = await Promise.all([
    getStandings(),
    getAllMatches(),
  ]);
  const form: Record<string, string[]> = {};
  for (const m of matches.filter(
    (x) => x.state === "post" && x.home.score !== null && x.away.score !== null,
  )) {
    const hs = m.home.score!,
      as = m.away.score!;
    (form[m.home.id] ??= []).push(hs > as ? "W" : hs === as ? "D" : "L");
    (form[m.away.id] ??= []).push(as > hs ? "W" : hs === as ? "D" : "L");
  }
  for (const k in form) form[k] = form[k].slice(-5);
  return (
    <>
      <AutoRefresh seconds={60} label={false} />
      <PageBanner
        eyebrow="Every point matters"
        title="The league table."
        description="Follow the race, track the form and see where your club stands. Current standings from the league feed."
      />
      <StaleBanner
        meta={{ ...meta, stale: meta.stale || mm.stale }}
        empty={!rows.length}
      />
      <main className="shell py-10">
        <div className="section-head">
          <h2 className="d text-3xl">Indian Super League</h2>
          <Link className="text-link" href="/matches">
            Fixtures & results →
          </Link>
        </div>
        <div className="bg-white border border-line p-2 md:p-6">
          {rows.length ? (
            <Table rows={rows} form={form} />
          ) : (
            <div className="empty-state">
              <h2>Standings unavailable</h2>
              <p className="text-mute text-sm">
                We’re waiting for the league feed. This page refreshes
                automatically.
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-5 text-xs text-mute mt-6">
          <p>
            P Played · W Won · D Drawn · L Lost · GD Goal difference · Pts
            Points
          </p>
          <p>Form: oldest → newest</p>
        </div>
        <Link
          href="/stories/reading-the-league-table"
          className="block mt-10 bg-[#e9ede6] p-6"
        >
          <span className="eyebrow text-mute">The game explained</span>
          <p className="d text-3xl mt-2">Make sense of the numbers →</p>
        </Link>
      </main>
    </>
  );
}
