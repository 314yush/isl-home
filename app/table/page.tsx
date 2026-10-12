import type { Metadata } from "next";
import { getAllMatches, getStandings } from "@/lib/data";
import Table from "@/components/Table";
import StaleBanner from "@/components/StaleBanner";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Table" };

export default async function TablePage() {
  const [{ rows, meta }, { matches }] = await Promise.all([getStandings(), getAllMatches()]);
  const form: Record<string, string[]> = {};
  for (const m of matches.filter((x) => x.state === "post")) {
    const hs = m.home.score ?? 0, as = m.away.score ?? 0;
    (form[m.home.id] ??= []).push(hs > as ? "W" : hs === as ? "D" : "L");
    (form[m.away.id] ??= []).push(as > hs ? "W" : hs === as ? "D" : "L");
  }
  for (const k in form) form[k] = form[k].slice(-5);
  return (
    <>
      <StaleBanner meta={meta} empty={!rows.length} />
      <section className="bg-ind text-white px-4 md:px-10 py-8"><h1 className="d text-[48px] md:text-[72px]">League table</h1><p className="opacity-80 text-sm mt-2">2026-27 season · regular season</p></section>
      <main className="max-w-[1000px] mx-auto px-3 md:px-6 pt-5">
        <div className="card p-4 md:p-6">{rows.length ? <Table rows={rows} form={form} /> : <p className="text-mute">Table unavailable right now.</p>}</div>
      </main>
    </>
  );
}
