import Link from "next/link";
import { getAllMatches, getStandings } from "@/lib/data";
import { clubOr } from "@/lib/clubs";
import { fmtDay, fmtDayLong, fmtTime, istDate, istWeekStart } from "@/lib/time";
import { watchFor } from "@/lib/watch";
import Badge from "@/components/Badge";
import MatchRow from "@/components/MatchRow";
import Table from "@/components/Table";
import StaleBanner from "@/components/StaleBanner";
import AutoRefresh from "@/components/AutoRefresh";
import { Duotone } from "@/components/Hero";
import type { Match } from "@/lib/types";

export const dynamic = "force-dynamic";

const NEWS = [
  { tag: "News", t: "Khel Now: latest ISL news and transfer updates", url: "https://khelnow.com/football/indian-super-league", c: ["#F26A21", "#2D168F"] },
  { tag: "Analysis", t: "The Bridge: Indian football coverage", url: "https://thebridge.in/football", c: ["#2D168F", "#E5004F"] },
  { tag: "Reports", t: "Sportstar: ISL match reports and previews", url: "https://sportstar.thehindu.com/football/indian-football/", c: ["#F4C300", "#1E0E62"] },
];

function groupByDay(ms: Match[]) {
  const g = new Map<string, Match[]>();
  for (const m of ms) { const k = istDate(m.kickoff); g.set(k, [...(g.get(k) ?? []), m]); }
  return [...g.entries()];
}

export default async function Home() {
  const [{ matches, meta }, { rows, meta: smeta }] = await Promise.all([getAllMatches(), getStandings()]);
  const live = matches.filter((m) => m.state === "in");
  const next = matches.find((m) => m.state === "pre");
  const last = [...matches].reverse().find((m) => m.state === "post");
  const hero = live[0] ?? next ?? last;
  const anchor = hero ?? matches[0];
  const wk = anchor ? istWeekStart(anchor.kickoff) : "";
  const week = matches.filter((m) => istWeekStart(m.kickoff) === wk);
  const latest = matches.filter((m) => m.state === "post").slice(-3).reverse();
  const wkEnd = wk ? new Date(new Date(wk + "T00:00:00Z").getTime() + 6 * 864e5).toISOString() : "";

  const thisWeek = (
<section className="card p-5">
            <div className="flex justify-between items-center mb-1">
              <h3 className="d text-ind text-[28px]">This week</h3><Link href="/matches" className="text-xs font-bold text-ind">All matches →</Link>
            </div>
            {wk && <p className="text-xs text-mute mb-1">{fmtDay(wk + "T06:00:00Z")} – {fmtDay(wkEnd)} · IST</p>}
            {week.length === 0 && <p className="text-sm text-mute py-4">No fixtures this week.</p>}
            {groupByDay(week).map(([d, ms]) => (
              <div key={d}>
                <p className="text-[11px] font-bold text-mute uppercase tracking-wider pt-3 pb-1">{fmtDayLong(ms[0].kickoff)}</p>
                {ms.map((m) => <MatchRow key={m.id} m={m} />)}
              </div>
            ))}
          </section>
  );
  return (
    <>
      <StaleBanner meta={{ ...meta, stale: meta.stale || smeta.stale }} empty={matches.length === 0} />
      {live.length > 0 && <AutoRefresh seconds={30} label={false} />}
      <main className="max-w-[1440px] mx-auto px-3 md:px-10 pt-4 md:pt-6 grid lg:grid-cols-[1fr_380px] gap-4 md:gap-5">
        <div className="flex flex-col gap-4 md:gap-5 min-w-0">
          {hero && <HeroCard m={hero} />}
          <div className="lg:hidden">{thisWeek}</div>
          <section>
            <h2 className="d text-ind text-[30px] md:text-[40px] mb-3">Latest results</h2>
            <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
              {latest.map((m) => {
                const h = clubOr(m.home.id, m.home.name, m.home.abbr), a = clubOr(m.away.id, m.away.name, m.away.abbr);
                return (
                  <Link key={m.id} href={`/match/${m.id}`} className="card block hover:-translate-y-0.5 transition">
                    <Duotone c1={h.primary} c2={a.primary} className="h-20 md:h-36">
                      <span className="d absolute left-3 bottom-2 text-white text-[44px] drop-shadow">{m.home.score}-{m.away.score}</span>
                    </Duotone>
                    <div className="p-3.5">
                      <p className="tag">Full time · {fmtDay(m.kickoff)}</p>
                      <p className="font-bold text-[17px] leading-tight mt-1">{h.name} {m.home.score}–{m.away.score} {a.name}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
          <section>
            <div className="flex items-end justify-between mb-3"><h2 className="d text-ind text-[30px] md:text-[40px]">Elsewhere</h2><span className="text-xs text-mute">Headlines live on the publishers&apos; sites</span></div>
            <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
              {NEWS.map((n) => (
                <a key={n.url} href={n.url} target="_blank" rel="noopener" className="card block">
                  <Duotone c1={n.c[0]} c2={n.c[1]} className="h-16 md:h-24" />
                  <div className="p-3.5"><p className="tag">{n.tag} ↗</p><p className="font-bold text-[16px] leading-tight mt-1">{n.t}</p></div>
                </a>
              ))}
            </div>
          </section>
        </div>
        <aside className="flex flex-col gap-4 md:gap-5">
          <div className="hidden lg:block">{thisWeek}</div>
          <section className="card p-5">
            <div className="flex justify-between items-center mb-2"><h3 className="d text-ind text-[28px]">Table</h3><Link href="/table" className="text-xs font-bold text-ind">Full table →</Link></div>
            {rows.length ? <Table rows={rows} compact /> : <p className="text-sm text-mute">Table unavailable right now.</p>}
          </section>
          <div className="bg-mint rounded-[10px] px-5 py-4 text-[#062B22]"><p className="d text-[22px]">Fan zones · coming soon</p><p className="text-[13.5px] mt-1">Watch-parties and travel groups for all 13 clubs.</p></div>
        </aside>
      </main>
    </>
  );
}

function HeroCard({ m }: { m: Match }) {
  const h = clubOr(m.home.id, m.home.name, m.home.abbr), a = clubOr(m.away.id, m.away.name, m.away.abbr);
  const w = watchFor(m.id);
  const label = m.state === "in" ? "Live now" : m.state === "pre" ? "Next up" : "Latest result";
  return (
    <Link href={`/match/${m.id}`} className="block rounded-[10px] overflow-hidden">
      <Duotone c1={h.primary} c2={a.primary} className="h-[340px] md:h-[440px]">
        <div className="absolute inset-0 bg-gradient-to-t from-ind via-ind/50 to-transparent" />
        <div className="absolute left-5 right-5 md:left-10 md:right-10 bottom-6 md:bottom-9 text-white">
          {m.state === "in" ? <span className="live">LIVE {m.statusText}</span> : <span className="bg-org text-ind text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{label}</span>}
          <div className="flex items-center gap-3 md:gap-5 mt-4">
            <Badge id={m.home.id} size={64} />
            {m.state === "pre"
              ? <span className="d text-[44px] md:text-[64px]">{fmtTime(m.kickoff)}<span className="text-[22px] md:text-[28px] ml-2 opacity-80">IST</span></span>
              : <span className="d text-[64px] md:text-[88px]">{m.home.score} - {m.away.score}</span>}
            <Badge id={m.away.id} size={64} />
          </div>
          <h1 className="d text-[38px] md:text-[60px] mt-3 max-w-[820px]">{h.name} <span className="text-org">v</span> {a.name}</h1>
          <p className="text-[13px] md:text-sm opacity-85 mt-2">{fmtDayLong(m.kickoff)} · {fmtTime(m.kickoff)} IST{m.venue ? ` · ${m.venue}` : ""}{m.state !== "post" ? ` · ${w.streams.map((s) => s.label.replace("Watch free on ", "Free on ")).join(" / ")}` : ""}</p>
        </div>
      </Duotone>
    </Link>
  );
}
