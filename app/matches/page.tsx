import type { Metadata } from "next";
import { getAllMatches } from "@/lib/data";
import { fmtDayLong, istDate } from "@/lib/time";
import MatchRow from "@/components/MatchRow";
import StaleBanner from "@/components/StaleBanner";
import { watchFor } from "@/lib/watch";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Matches" };

export default async function Matches() {
  const { matches, meta } = await getAllMatches();
  const g = new Map<string, typeof matches>();
  for (const m of matches) { const k = istDate(m.kickoff); g.set(k, [...(g.get(k) ?? []), m]); }
  const today = istDate(new Date());
  const w = watchFor("");
  return (
    <>
      <StaleBanner meta={meta} empty={!matches.length} />
      <section className="bg-ind text-white px-4 md:px-10 py-8"><h1 className="d text-[48px] md:text-[72px]">Fixtures &amp; results</h1>
        <p className="opacity-80 text-sm mt-2">All kick-offs in IST. Where to watch: {w.streams.map((s) => s.label).join(" · ")}. {w.note}</p></section>
      <main className="max-w-[900px] mx-auto px-3 md:px-6 pt-5 flex flex-col gap-4">
        {[...g.entries()].map(([d, ms]) => (
          <section key={d} id={d} className="card px-4 md:px-6 py-3">
            <h2 className="d text-ind text-[22px] py-1 flex items-center gap-2">{fmtDayLong(ms[0].kickoff)}{d === today && <span className="bg-org text-ind text-[11px] px-2 py-0.5 rounded">Today</span>}</h2>
            {ms.map((m) => <MatchRow key={m.id} m={m} />)}
          </section>
        ))}
      </main>
    </>
  );
}
