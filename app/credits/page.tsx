/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { CLUBS } from "@/lib/clubs";
import { CRESTS, LEAGUE_LOGO, PHOTOS, PLAYERS } from "@/lib/assets";
export const metadata: Metadata = { title: "Credits" };
const L = ({ href, children }: { href?: string; children: React.ReactNode }) => (href ? <a href={href} className="underline" target="_blank" rel="noopener">{children}</a> : <>{children}</>);
export default function Credits() {
  const h = "d text-ind text-[28px] mt-8 mb-3";
  return (
    <>
      <section className="bg-ind text-white px-4 md:px-10 py-8"><h1 className="d text-[48px] md:text-[72px]">Credits</h1>
        <p className="opacity-80 text-sm mt-2 max-w-[780px]">This is a fan-run, non-commercial site. Crests, logos and images belong to their owners and are used for identification and commentary. Rights holders can ask for removal and we&apos;ll take it down promptly.</p></section>
      <main className="max-w-[1000px] mx-auto px-4 md:px-6 pt-2 text-[14px]">
        <h2 className={h}>League logo</h2>
        {LEAGUE_LOGO && <p className="flex items-center gap-3"><img src={LEAGUE_LOGO.src} alt="" className="h-10" />Indian Super League logo · <L href={LEAGUE_LOGO.source}>source</L> · {LEAGUE_LOGO.license}</p>}
        <h2 className={h}>Club crests</h2>
        <div className="grid sm:grid-cols-2 gap-2">{CLUBS.map((c) => { const a = CRESTS[c.slug]; return a ? <p key={c.slug} className="flex items-center gap-3"><img src={a.src} alt="" className="h-8 w-8 object-contain" />{c.name} · <L href={a.source}>source</L></p> : <p key={c.slug}>{c.name}: monogram (no crest)</p>; })}</div>
        <p className="text-mute text-xs mt-2">Crests are trademarks of their clubs. Files from English Wikipedia (non-free, used there under fair use).</p>
        <h2 className={h}>Photos</h2>
        <ul className="list-disc pl-5 space-y-1">{Object.entries(PHOTOS).map(([k, a]) => <li key={k}><L href={a.source}>{k.replace(/_/g, " ")}</L> · {a.credit} · {a.license}</li>)}</ul>
        <h2 className={h}>Player photos</h2>
        <ul className="list-disc pl-5 space-y-1">{Object.entries(PLAYERS).map(([k, a]) => <li key={k}><L href={a.source}>{decodeURIComponent((a.source ?? k).split("File:").pop() ?? k).replace(/_/g, " ")}</L> · {a.credit} · {a.license}</li>)}</ul>
        <h2 className={h}>Data</h2>
        <p>Scores, fixtures, lineups and stats: ESPN (unofficial public feed). Cross-check: TheSportsDB.</p>
      </main>
    </>
  );
}
