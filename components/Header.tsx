import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { getAllMatches } from "@/lib/data";
import Ticker from "./Ticker";
import NavLinks from "./NavLinks";
import LeagueLogo from "./LeagueLogo";

export default async function Header() {
  const { matches } = await getAllMatches();
  const now = Date.now();
  const live = matches.filter((m) => m.state === "in");
  const recent = matches.filter((m) => m.state === "post" && now - +new Date(m.kickoff) < 4 * 864e5).slice(-4);
  const next = matches.filter((m) => m.state === "pre").slice(0, 8);
  const tick = [...live, ...recent.reverse(), ...next].slice(0, 10);
  return (
    <>
      <div className="bg-night text-[#B9B3E0] text-xs hidden md:flex justify-between px-10 py-2">
        <span>Fan-run hub · Not affiliated with the ISL or any club</span>
        <span className="flex gap-4"><Link href="/matches">Where to watch</Link><span>Fan zones <b className="text-mint">SOON</b></span></span>
      </div>
      <header className="bg-ind text-white flex items-center px-4 md:px-10 gap-10 h-16 md:h-[76px]">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-9 h-9 md:w-10 md:h-10 bg-org rounded-lg flex items-center justify-center d text-ind text-[26px]">{BRAND.monogram}</span>
          <span className="d text-[28px] md:text-[34px] tracking-wide">{BRAND.name}</span>
        </Link>
        <NavLinks />
        <span className="ml-auto flex items-center gap-3"><span className="text-[13px] opacity-80 hidden sm:inline">All times IST</span><LeagueLogo size={36} /></span>
      </header>
      <Ticker matches={tick} />
    </>
  );
}
