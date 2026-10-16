import { BRAND } from "@/lib/brand";
import Link from "next/link";
import Icon from "./Icon";
export default function Footer() {
  return (
    <footer className="bg-night text-white mt-20 pt-14 pb-8">
      <div className="shell">
        <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-10 pb-12 border-b border-white/15">
          <div>
            <Link href="/" className="wordmark">
              {BRAND.name.toLowerCase()}
              <span className="text-org">.</span>
            </Link>
            <p className="d text-[34px] mt-5 max-w-sm">
              Our game.
              <br />
              Our people. Our ground.
            </p>
            <p className="text-white/55 text-sm mt-4">
              An independent home for Indian football fans.
            </p>
          </div>
          <div>
            <p className="eyebrow text-white/45 mb-5">Follow the game</p>
            <div className="grid gap-3 text-sm">
              {[
                ["Matches", "/matches"],
                ["League table", "/table"],
                ["Club statistics", "/stats"],
                ["All clubs", "/clubs"],
                ["Stories & guides", "/stories"],
              ].map(([l, h]) => (
                <Link key={h} href={h} className="hover:text-org">
                  {l}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow text-white/45 mb-5">From the stands</p>
            <div className="grid gap-3 text-sm">
              <Link href="/my-club">Find your club</Link>
              <Link href="/about">About Maidan</Link>
              <Link href="/credits">Image credits</Link>
              <a
                href="https://www.youtube.com/@IndianSuperLeague"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                ISL on YouTube <Icon name="arrow" size={14} />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-6 flex flex-col md:flex-row justify-between gap-4 text-[11px] leading-relaxed text-white/45">
          <p className="max-w-2xl">
            Fan-run. No ads. Not affiliated with the Indian Super League, AIFF
            or any club. Club marks and photographs belong to their respective
            owners.
          </p>
          <p className="shrink-0">Football data via ESPN · All times IST</p>
        </div>
      </div>
    </footer>
  );
}
