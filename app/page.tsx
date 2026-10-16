/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getAllMatches, getStandings } from "@/lib/data";
import { CLUBS } from "@/lib/clubs";
import { photo } from "@/lib/assets";
import { STORIES } from "@/lib/stories";
import Badge from "@/components/Badge";
import Table from "@/components/Table";
import StaleBanner from "@/components/StaleBanner";
import AutoRefresh from "@/components/AutoRefresh";
import StoryCard from "@/components/StoryCard";
import MatchCard from "@/components/MatchCard";
import Icon from "@/components/Icon";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [{ matches, meta }, { rows, meta: smeta }] = await Promise.all([
    getAllMatches(),
    getStandings(),
  ]);
  const featured = [
    ...matches.filter((m) => m.state === "in"),
    ...matches.filter((m) => m.state === "pre"),
    ...matches.filter((m) => m.state === "post").reverse(),
  ].slice(0, 3);
  const hero = photo("salt_lake_stadium_indian_super_league_opener");
  return (
    <>
      <AutoRefresh label={false} />
      <StaleBanner
        meta={{ ...meta, stale: meta.stale || smeta.stale }}
        empty={!matches.length}
      />
      <main>
        <div className="shell pt-6 md:pt-8">
          <div className="flex justify-between items-center mb-5">
            <p className="eyebrow text-mute">Indian football. One home.</p>
            <span className="eyebrow text-mute hidden sm:inline">
              Independent. Fan-powered.
            </span>
          </div>
          <div className="hero-layout reveal">
            <section className="hero-feature">
              {hero && (
                <img
                  className="hero-photo"
                  src={hero.src}
                  alt="Supporters filling the stands at Salt Lake Stadium"
                  fetchPriority="high"
                />
              )}
              <div className="absolute top-6 left-6 md:left-10 z-10 flex items-center gap-2">
                <span className="w-2 h-2 bg-org" />
                <span className="eyebrow text-white">
                  The beautiful game. Our way.
                </span>
              </div>
              <div className="hero-copy">
                <p className="eyebrow text-white/70">
                  From the streets to the stands
                </p>
                <h1 className="hero-title">
                  One game.
                  <br />A billion
                  <br />
                  <span className="text-org">heartbeats.</span>
                </h1>
                <p className="text-white/75 text-sm md:text-base max-w-md leading-relaxed mb-6">
                  Every club. Every chant. Every last-minute winner.
                  <br className="hidden sm:block" /> Your home for the game we
                  call our own.
                </p>
                <Link
                  href="/stories/a-game-that-belongs-to-everyone"
                  className="btn btn-primary"
                >
                  Welcome to Maidan <Icon name="arrow" size={18} />
                </Link>
              </div>
            </section>
            <aside className="bg-white border border-line flex flex-col">
              <div className="px-5 py-5 border-b border-line flex justify-between items-center">
                <h2 className="d text-[28px]">Match centre</h2>
                <span className="eyebrow text-mute">IST</span>
              </div>
              <div className="flex-1">
                {featured.length ? (
                  featured.slice(0, 2).map((m) => (
                    <div
                      key={m.id}
                      className="[&>div]:border-0 [&>div]:border-b"
                    >
                      <MatchCard match={m} />
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-sm text-mute leading-relaxed">
                    Fixtures are unavailable right now. We’ll refresh them
                    automatically.
                  </div>
                )}
              </div>
              <Link
                href="/matches"
                className="p-5 text-link justify-between bg-bg"
              >
                All fixtures & results <Icon name="arrow" size={18} />
              </Link>
              <div className="bg-mint px-5 py-4 flex items-center gap-3">
                <Icon name="ball" size={26} />
                <p className="text-xs leading-relaxed">
                  Different colours.
                  <br />
                  <b>The same love for the game.</b>
                </p>
              </div>
            </aside>
          </div>
          <div className="flex items-center gap-3 py-3 text-[10px] text-mute border-b border-line">
            <span className="eyebrow text-[9px]">From the archive</span>
            <span className="w-1 h-1 bg-mute rounded-full" />
            <span>Salt Lake Stadium, Kolkata</span>
            <Link
              href="/credits"
              className="ml-auto underline underline-offset-2"
            >
              Photo credits
            </Link>
          </div>
        </div>
        <section className="shell py-12 md:py-16">
          <div className="section-head">
            <div>
              <p className="eyebrow text-mute mb-3">Beyond the ninety</p>
              <h2 className="section-title">From the stands</h2>
            </div>
            <Link href="/stories" className="text-link">
              All stories <Icon name="arrow" size={17} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STORIES.slice(1).map((s) => (
              <StoryCard key={s.slug} story={s} />
            ))}
          </div>
        </section>
        <section className="bg-[#e9ede6] py-12 md:py-16 border-y border-line">
          <div className="shell grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-20">
            <div className="flex flex-col justify-between">
              <div>
                <p className="eyebrow text-mute mb-3">Every point matters</p>
                <h2 className="d text-[58px] md:text-[76px]">
                  The race.
                  <br />
                  The rivalries.
                  <br />
                  <span className="text-[#b94322]">The table.</span>
                </h2>
                <p className="text-sm text-mute max-w-sm leading-relaxed my-6">
                  Follow the season as it unfolds. See who’s setting the pace
                  and where your club stands.
                </p>
                <Link href="/table" className="btn btn-dark">
                  Explore the table <Icon name="arrow" size={18} />
                </Link>
              </div>
              <div className="flex gap-8 mt-10 pt-6 border-t border-[#c8d0c7]">
                <div>
                  <b className="d text-4xl">{rows.length || CLUBS.length}</b>
                  <p className="eyebrow text-mute mt-2">
                    {rows.length ? "Clubs in the table" : "Club profiles"}
                  </p>
                </div>
                <div>
                  <b className="d text-4xl">
                    {matches.filter((m) => m.state === "post").length || "—"}
                  </b>
                  <p className="eyebrow text-mute mt-2">Results in the feed</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-line p-5 md:p-7">
              <div className="flex items-center justify-between mb-3">
                <h3 className="d text-[28px]">League standings</h3>
                <span className="eyebrow text-mute">Top 6</span>
              </div>
              {rows.length ? (
                <Table rows={rows.slice(0, 6)} compact />
              ) : (
                <div className="empty-state">
                  <h3>Table on its way</h3>
                  <p className="text-sm text-mute">
                    The standings feed is currently unavailable.
                  </p>
                </div>
              )}
              <Link
                href="/table"
                className="text-link justify-between w-full pt-5 mt-3 border-t border-line"
              >
                View full standings <Icon name="arrow" size={16} />
              </Link>
            </div>
          </div>
        </section>
        <section className="shell py-12 md:py-16">
          <div className="section-head">
            <div>
              <p className="eyebrow text-mute mb-3">Find your colours</p>
              <h2 className="section-title">One league. Many homes.</h2>
            </div>
            <Link href="/clubs" className="text-link">
              All clubs <Icon name="arrow" size={17} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CLUBS.filter((c) =>
              [
                "bengaluru-fc",
                "kerala-blasters",
                "mohun-bagan-sg",
                "mumbai-city",
                "fc-goa",
                "east-bengal",
              ].includes(c.slug),
            ).map((c) => (
              <Link
                href={`/club/${c.slug}`}
                key={c.id}
                className="group border border-line bg-white p-6 text-center hover:border-ind"
              >
                <div className="flex justify-center mb-5 group-hover:-translate-y-1 transition-transform">
                  <Badge id={c.id} size={58} />
                </div>
                <h3 className="font-display text-xl font-semibold">{c.name}</h3>
                <p className="text-xs text-mute mt-1">{c.city}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="shell">
          <div className="bg-org p-7 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-7 relative overflow-hidden">
            <div>
              <p className="eyebrow mb-3">Your colours. Your corner.</p>
              <h2 className="d text-[48px] md:text-[66px]">It’s personal.</h2>
              <p className="mt-3 text-sm">
                Pick your club. Keep your next match close.
              </p>
            </div>
            <Link href="/my-club" className="btn btn-dark">
              Find my club <Icon name="heart" size={18} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
