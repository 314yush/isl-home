import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { CLUBS } from "@/lib/clubs";
import Badge from "./Badge";
import NavLinks from "./NavLinks";
import Icon from "./Icon";
export default function Header() {
  return (
    <>
      <div className="bg-white border-b border-line">
        <div className="shell club-rail noscroll">
          <Link
            href="/clubs"
            className="eyebrow text-mute hidden lg:block mr-3"
          >
            The clubs
          </Link>
          {CLUBS.map((c) => (
            <Link key={c.id} href={`/club/${c.slug}`} aria-label={c.name}>
              <Badge id={c.id} size={30} />
            </Link>
          ))}
        </div>
      </div>
      <header className="bg-ind text-white sticky top-0 z-40 border-b border-white/10">
        <div className="shell flex items-center justify-between gap-6 h-[76px] md:h-[84px]">
          <Link href="/" className="wordmark" aria-label={`${BRAND.name} home`}>
            {BRAND.name.toLowerCase()}
            <span className="wordmark-dot">.</span>
          </Link>
          <NavLinks />
          <div className="flex items-center gap-5">
            <Link
              href="/matches"
              aria-label="Find a match"
              className="hidden lg:block"
            >
              <Icon name="search" />
            </Link>
            <Link
              href="/my-club"
              className="flex items-center gap-2 text-xs font-semibold border border-white/25 px-3 py-2.5 hover:bg-white/10"
            >
              <Icon name="heart" size={16} />
              <span>My club</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
