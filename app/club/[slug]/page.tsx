import AutoRefresh from "@/components/AutoRefresh";
import { FollowClub } from "@/components/FavouriteClub";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { clubBySlug } from "@/lib/clubs";
import { getAllMatches, getSquad, getStandings } from "@/lib/data";
import Badge from "@/components/Badge";
import MatchRow from "@/components/MatchRow";
import Table from "@/components/Table";
import StaleBanner from "@/components/StaleBanner";
import { Credit } from "@/components/Hero";
import Avatar from "@/components/Avatar";
import { heroFor } from "@/lib/assets";
import { fmtDay } from "@/lib/time";

export const dynamic = "force-dynamic";
type P = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const c = clubBySlug((await params).slug);
  return { title: c?.name ?? "Club" };
}

const ORDER = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

export default async function ClubPage({ params }: P) {
  const c = clubBySlug((await params).slug);
  if (!c) notFound();
  const [{ matches, meta }, { rows, meta: tm }, { squad, meta: qm }] =
    await Promise.all([getAllMatches(), getStandings(), getSquad(c.id)]);
  const mine = matches.filter((m) => m.home.id === c.id || m.away.id === c.id);
  const past = mine.filter((m) => m.state === "post"),
    live = mine.filter((m) => m.state === "in"),
    next = mine.filter((m) => m.state === "pre");
  const pos = rows.find((r) => r.team.id === c.id);
  const idx = rows.findIndex((r) => r.team.id === c.id);
  const around = rows.slice(
    Math.max(0, Math.min(idx - 2, rows.length - 5)),
    Math.max(0, Math.min(idx - 2, rows.length - 5)) + 5,
  );
  const groups = ORDER.concat("Other")
    .map(
      (g) =>
        [
          g,
          squad.filter(
            (p) => (ORDER.includes(p.position) ? p.position : "Other") === g,
          ),
        ] as const,
    )
    .filter(([, ps]) => ps.length);
  const light = ["#F4C300", "#58A6DD", "#F26A21"].includes(c.primary);
  const fg = light ? c.secondary : "#fff";
  const nextMatch = next[0];
  const hero = heroFor(c.slug);

  return (
    <>
      <AutoRefresh label={false} />
      <StaleBanner
        meta={{ ...meta, stale: meta.stale || qm.stale || tm.stale }}
      />
      <section
        className="relative overflow-hidden"
        style={{ background: c.primary, color: fg }}
      >
        {hero && (
          <div
            className="absolute inset-0 md:left-[38%]"
            style={{ clipPath: "polygon(14% 0,100% 0,100% 100%,0 100%)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.src} alt="" className="w-full h-full object-cover" />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, ${c.primary} 0%, transparent 45%)`,
              }}
            />
          </div>
        )}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background: `linear-gradient(90deg, ${c.primary} 55%, ${c.primary}88 100%)`,
          }}
        />
        <div
          className="absolute left-0 right-0 bottom-0 h-2"
          style={{ background: c.secondary }}
        />
        {hero && <Credit a={hero} className="right-2 bottom-4" />}
        <div className="relative px-4 md:px-10 py-8 md:py-14 max-w-full md:max-w-[65%]">
          <p className="eyebrow mb-5">The club hub · {c.city}</p>
          <Badge id={c.id} size={88} />
          <h1 className="d text-[50px] md:text-[88px] mt-4 break-words">
            {c.name}
          </h1>
          <p className="font-semibold mt-2 opacity-90">
            {c.city}
            {pos
              ? ` · ${ordinal(pos.rank)} in the table · ${pos.points} pts from ${pos.played}`
              : ""}
          </p>
          <div className="mt-6">
            <FollowClub id={c.id} />
          </div>
          {nextMatch && (
            <p className="mt-4 inline-block bg-black/25 rounded-md px-3 py-2 text-sm font-semibold text-white">
              Next:{" "}
              {nextMatch.home.id === c.id
                ? "vs " + nextMatch.away.shortName
                : "at " + nextMatch.home.shortName}{" "}
              · {fmtDay(nextMatch.kickoff)}
            </p>
          )}
        </div>
      </section>
      <nav
        aria-label="Club sections"
        className="shell flex gap-7 py-5 border-b border-line text-sm font-semibold"
      >
        <a href="#fixtures">Fixtures & results</a>
        <a href="#squad">Squad</a>
        <a href="#position">Table position</a>
      </nav>
      <main className="max-w-[1440px] mx-auto px-3 md:px-10 pt-5 grid lg:grid-cols-[1fr_380px] gap-4 md:gap-5">
        <div className="flex flex-col gap-4 md:gap-5 min-w-0">
          <section
            className="card p-5"
            style={{ borderTop: `4px solid ${c.primary}` }}
          >
            <h2
              id="fixtures"
              className="d text-[30px] mb-1"
              style={{ color: light ? "#14112B" : c.primary }}
            >
              Fixtures &amp; results
            </h2>
            {[...live, ...next].length > 0 && (
              <p className="tag pt-2">Upcoming</p>
            )}
            {[...live, ...next].map((m) => (
              <div key={m.id}>
                <p className="text-[11px] text-mute font-bold uppercase pt-2">
                  {fmtDay(m.kickoff)}
                </p>
                <MatchRow m={m} />
              </div>
            ))}
            {past.length > 0 && <p className="tag pt-4">Results</p>}
            {[...past].reverse().map((m) => (
              <div key={m.id}>
                <p className="text-[11px] text-mute font-bold uppercase pt-2">
                  {fmtDay(m.kickoff)}
                </p>
                <MatchRow m={m} />
              </div>
            ))}
            {mine.length === 0 && (
              <p className="text-sm text-mute">No fixtures available.</p>
            )}
          </section>
          <section
            className="card p-5"
            style={{ borderTop: `4px solid ${c.primary}` }}
          >
            <h2
              id="squad"
              className="d text-[30px] mb-3"
              style={{ color: light ? "#14112B" : c.primary }}
            >
              Squad
            </h2>
            {squad.length === 0 && (
              <p className="text-sm text-mute">Squad unavailable right now.</p>
            )}
            {groups.map(([g, ps]) => (
              <div key={g} className="mb-4">
                <p className="tag mb-2">{g}s</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {ps
                    .sort(
                      (x, y) => Number(x.number ?? 99) - Number(y.number ?? 99),
                    )
                    .map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-2.5 rounded-lg bg-bg p-2.5"
                      >
                        <Avatar
                          id={p.id}
                          name={p.name}
                          size={44}
                          bg={c.primary}
                          fg={c.secondary}
                        />
                        <span
                          className="d text-[22px] w-7 text-center"
                          style={{ color: light ? c.secondary : c.primary }}
                        >
                          {p.number ?? "–"}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-[14px] leading-tight truncate">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-mute">
                            {p.age ? `${p.age} yrs` : ""}
                            {p.nationality ? ` · ${p.nationality}` : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </section>
        </div>
        <aside className="flex flex-col gap-4">
          <section className="card p-5">
            <h3 id="position" className="d text-ind text-[28px] mb-2">
              Table position
            </h3>
            {around.length ? (
              <Table rows={around} compact highlight={c.id} />
            ) : (
              <p className="text-sm text-mute">Unavailable.</p>
            )}
          </section>
        </aside>
      </main>
    </>
  );
}
function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
