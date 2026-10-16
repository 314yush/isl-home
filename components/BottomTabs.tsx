"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "./NavLinks";
export default function BottomTabs() {
  const p = usePathname();
  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-ind text-white grid grid-cols-6 h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] border-t border-white/15"
    >
      {NAV.map((n, i) => (
        <Link
          key={n.href}
          href={n.href}
          aria-current={n.match(p) ? "page" : undefined}
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold ${n.match(p) ? "text-org bg-white/5" : "text-white/70"}`}
        >
          <span className="font-display text-lg leading-none">
            {["⌂", "◉", "≡", "◇", "▥", "▤"][i]}
          </span>
          {n.label}
        </Link>
      ))}
    </nav>
  );
}
