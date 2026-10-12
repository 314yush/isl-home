/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMatch } from "@/lib/data";
import { clubOr } from "@/lib/clubs";
import { fmtDayLong, fmtTime } from "@/lib/time";
import { watchFor } from "@/lib/watch";
import Badge from "@/components/Badge";
import Pitch from "@/components/Pitch";
import StaleBanner from "@/components/StaleBanner";
import AutoRefresh from "@/components/AutoRefresh";
import { Credit } from "@/components/Hero";
import { heroFor } from "@/lib/assets";
import type { MatchEvent } from "@/lib/types";

export const dynamic = "force-dynamic";
type P = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { id } = await params;
  const { detail } = await getMatch(id);
  if (!detail) return { title: "Match" };
  const m = detail.match;
  return { title: `${m.home.shortName} v ${m.away.shortName}` };
}

const ICON: Record<MatchEvent["kind"], string> = { goal: "⚽", "own-goal": "⚽", penalty: "⚽", yellow: "▮", red: "▮", sub: "⇄", other: "•" };
const mins = (s: string) => { const [a, b] = s.replace(/'/g, "").split("+"); return Number(a) + (Number(b) || 0) / 100; };

export default async function MatchPage({ params }: P) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const { detail, meta } = await getMatch(id);
  if (!detail) {
    if (meta.error) return <><StaleBanner meta={meta} /><main className="p-10 text-center text-mute">Match centre unavailable right now.</main></>;
    notFound();
  }
  const { match: m, events, stats, lineups, attendance } = detail;
  const h = clubOr(m.home.id, m.home.name, m.home.abbr), a = clubOr(m.away.id, m.away.name, m.away.abbr);
  const w = watchFor(m.id);
  const bg = heroFor(h.slug);
  const scorers = (tid: string) => events.filter((e) => ["goal", "own-goal", "penalty"].includes(e.kind) && e.teamId === tid)
    .map((e) => `${e.player.split(" ").slice(-1)[0]} ${e.minute}${e.kind === "own-goal" ? " (og)" : e.kind === "penalty" ? " (p)" : ""}`).join(" · ");
  // own goals are credited by ESPN to the benefiting team already
  const evs = [...events].sort((x, y) => mins(x.minute) - mins(y.minute));
  const subs = (side: "home" | "away") => lineups?.[side].players.filter((p) => !p.starter) ?? [];

  return (
    <>
      <StaleBanner meta={meta} />
      <section className="text-white px-4 md:px-10 pt-7 pb-7 relative overflow-hidden" style={{ background: `linear-gradient(120deg, ${h.primary} 0%, #1E0E62 42%, #1E0E62 58%, ${a.primary} 100%)` }}>
        {bg && <><img src={bg.src} alt="" className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity" /><Credit a={bg} className="right-2 bottom-2" /></>}
        <p className="relative text-center text-[12px] md:text-[13px] font-semibold opacity-85">{fmtDayLong(m.kickoff)} · {fmtTime(m.kickoff)} IST{m.venue ? ` · ${m.venue}` : ""}{m.city ? `, ${m.city}` : ""}</p>
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center mt-5 gap-2">
          <Link href={`/club/${h.slug}`} className="flex flex-col-reverse md:flex-row items-center md:justify-end gap-2 md:gap-5 text-center md:text-right">
            <div><p className="d text-[22px] md:text-[52px]">{h.name}</p><p className="text-[11px] md:text-[13px] opacity-85 mt-1 hidden sm:block">{scorers(m.home.id)}</p></div>
            <Badge id={m.home.id} size={72} />
          </Link>
          <div className="text-center px-1 md:px-8">
            {m.state === "pre" ? <div className="d text-[44px] md:text-[80px] bg-black/25 px-4 md:px-7 py-1.5 rounded-xl">{fmtTime(m.kickoff)}</div>
              : <div className="d text-[56px] md:text-[118px] leading-none bg-black/25 px-3 md:px-7 py-1.5 rounded-xl">{m.home.score} - {m.away.score}</div>}
            <div className="mt-3">{m.state === "in" ? <span className="live text-[13px]">LIVE {m.statusText}</span> : <span className="text-sm font-bold opacity-90">{m.state === "post" ? "Full time" : m.state === "pre" ? "Kick-off IST" : m.statusText}</span>}</div>
          </div>
          <Link href={`/club/${a.slug}`} className="flex flex-col md:flex-row items-center gap-2 md:gap-5 text-center md:text-left">
            <Badge id={m.away.id} size={72} />
            <div><p className="d text-[22px] md:text-[52px]">{a.name}</p><p className="text-[11px] md:text-[13px] opacity-85 mt-1 hidden sm:block">{scorers(m.away.id)}</p></div>
          </Link>
        </div>
        <div className="relative flex flex-wrap justify-center gap-2.5 mt-6">
          {w.streams.map((s, i) => <a key={s.url} href={s.url} target="_blank" rel="noopener" className={i === 0 ? "bg-org text-ind font-bold px-4 py-2 rounded-md text-sm" : "border border-white/50 px-4 py-2 rounded-md text-sm font-semibold"}>{i === 0 ? "▶ " : ""}{s.label}</a>)}
          {attendance ? <span className="border border-white/50 px-4 py-2 rounded-md text-sm font-semibold">Attendance {attendance.toLocaleString("en-IN")}</span> : null}
          {m.state === "in" && <span className="px-2 py-2"><AutoRefresh seconds={30} /></span>}
        </div>
      </section>

      <main className="max-w-[1440px] mx-auto px-3 md:px-10 pt-5 grid lg:grid-cols-2 gap-4 md:gap-5">
        <section className="card p-5">
          <h3 className="d text-ind text-[28px] mb-2">Key events</h3>
          {evs.length === 0 && <p className="text-sm text-mute py-3">{m.state === "pre" ? "Events appear here once the match kicks off." : "No events reported."}</p>}
          {evs.map((e, i) => {
            const home = e.teamId === m.home.id;
            const col = e.kind === "yellow" ? "#F2C200" : e.kind === "red" ? "#E5004F" : e.kind === "sub" ? "#13B35B" : "#1E0E62";
            const inner = (
              <div className={`flex items-center gap-2.5 ${home ? "flex-row-reverse text-right" : ""}`}>
                <span className="w-[30px] h-[30px] flex-none rounded-full bg-[#F3F2F8] flex items-center justify-center text-[15px]" style={{ color: col }}>{ICON[e.kind]}</span>
                <div className="min-w-0"><b className="text-[14px] md:text-[14.5px] block md:truncate leading-tight">{e.player}</b>{e.detail && <p className="text-[12px] text-mute md:truncate">{e.detail}</p>}</div>
              </div>
            );
            return (
              <div key={i} className="grid grid-cols-[1fr_56px_1fr] items-center py-2 border-t border-[#F3F2F8]">
                <div className="min-w-0">{home && inner}</div><span className="d text-center text-[20px] text-ind">{e.minute}</span><div className="min-w-0">{!home && inner}</div>
              </div>
            );
          })}
        </section>
        <section className="card p-5">
          <h3 className="d text-ind text-[28px] mb-3">Match stats</h3>
          <div className="flex justify-between mb-3"><Badge id={m.home.id} size={30} /><Badge id={m.away.id} size={30} /></div>
          {stats.length === 0 && <p className="text-sm text-mute">Stats appear once the match is under way.</p>}
          {stats.map((s) => {
            const tot = s.home + s.away || 1;
            return (
              <div key={s.key} className="mb-3.5">
                <div className="flex justify-between font-bold text-[15px]"><span>{s.homeDisplay}</span><span className="text-[13px] text-mute font-semibold">{s.label}</span><span>{s.awayDisplay}</span></div>
                <div className="flex gap-1.5 mt-1.5 h-2">
                  <div className="flex-1 bg-[#ECEAF3] rounded flex justify-end"><div className="rounded" style={{ width: `${(s.home / tot) * 100}%`, background: h.primary === "#111111" ? "#444" : h.primary }} /></div>
                  <div className="flex-1 bg-[#ECEAF3] rounded"><div className="h-full rounded" style={{ width: `${(s.away / tot) * 100}%`, background: a.primary === h.primary ? "#FF6A13" : a.primary }} /></div>
                </div>
              </div>
            );
          })}
        </section>
        <section className="card p-5 lg:col-span-2">
          <div className="flex flex-wrap gap-2 justify-between items-center mb-3.5"><h3 className="d text-ind text-[28px]">Lineups</h3>
            {lineups && <span className="text-[13px] font-bold text-mute">{h.mono} {lineups.home.formation} · {a.mono} {lineups.away.formation}</span>}</div>
          {lineups ? (
            <>
              <Pitch home={lineups.home.players} away={lineups.away.players} hc={[h.primary, h.secondary]} ac={[a.primary === h.primary ? "#FFFFFF" : a.primary, a.primary === h.primary ? a.primary : a.secondary]} />
              <div className="grid md:grid-cols-2 gap-3 md:gap-8 mt-3.5 text-[13px] text-[#4A4766]">
                <p><b>{h.mono} subs:</b> {subs("home").map((p) => `${p.number} ${p.name}${p.subbedIn ? " (on)" : ""}`).join(", ")}</p>
                <p className="md:text-right"><b>{a.mono} subs:</b> {subs("away").map((p) => `${p.number} ${p.name}${p.subbedIn ? " (on)" : ""}`).join(", ")}</p>
              </div>
            </>
          ) : <p className="text-sm text-mute">Lineups usually land 20–60 minutes before kick-off.</p>}
        </section>
      </main>
    </>
  );
}
