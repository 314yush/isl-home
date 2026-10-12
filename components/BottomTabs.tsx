"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "./NavLinks";
const ICON: Record<string, string> = { "/": "◉", "/matches": "⚽", "/table": "☰", "/clubs": "⬢" };
export default function BottomTabs() {
  const p = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-line grid grid-cols-4 h-16">
      {NAV.map((n) => (
        <Link key={n.href} href={n.href} className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${n.match(p) ? "text-ind" : "text-mute"}`}>
          <span className="text-lg leading-none">{ICON[n.href]}</span>{n.label}
          {n.match(p) && <span className="w-6 h-0.5 bg-org rounded" />}
        </Link>
      ))}
    </nav>
  );
}
