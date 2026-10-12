import { BRAND } from "@/lib/brand";
import { attribution } from "@/lib/data";
import Link from "next/link";
import LeagueLogo from "./LeagueLogo";
export default function Footer() {
  return (
    <footer className="bg-night text-[#B9B3E0] mt-12 px-4 md:px-10 py-8 flex flex-col md:flex-row gap-3 md:items-center justify-between text-[13px]">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        <span className="flex items-center gap-3"><span className="d text-white text-[28px]">{BRAND.name}</span><LeagueLogo size={34} /></span>
        <span>Fan-run, no ads, non-commercial. Not affiliated with the Indian Super League, AIFF or any club. Crests and images belong to their owners; credits at <Link href="/credits" className="underline text-white">/credits</Link>.</span>
      </div>
      <span>Data: {attribution} (unofficial feed) · cross-checked with TheSportsDB · All times IST</span>
    </footer>
  );
}
