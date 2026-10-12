import { BRAND } from "@/lib/brand";
import { attribution } from "@/lib/data";
export default function Footer() {
  return (
    <footer className="bg-night text-[#B9B3E0] mt-12 px-4 md:px-10 py-8 flex flex-col md:flex-row gap-3 md:items-center justify-between text-[13px]">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        <span className="d text-white text-[28px]">{BRAND.name}</span>
        <span>Fan-run, no ads, non-commercial. Not affiliated with the Indian Super League, AIFF or any club. Club badges are monogram placeholders.</span>
      </div>
      <span>Data: {attribution} (unofficial feed) · cross-checked with TheSportsDB · All times IST</span>
    </footer>
  );
}
