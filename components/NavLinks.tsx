"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export const NAV = [
  { href: "/", label: "Matchday", match: (p: string) => p === "/" },
  { href: "/matches", label: "Matches", match: (p: string) => p.startsWith("/match") },
  { href: "/table", label: "Table", match: (p: string) => p === "/table" },
  { href: "/clubs", label: "Clubs", match: (p: string) => p.startsWith("/club") },
];
export default function NavLinks() {
  const p = usePathname();
  return (
    <nav className="d hidden md:flex gap-8 text-[21px] font-bold self-stretch">
      {NAV.map((n) => (
        <Link key={n.href} href={n.href} className={`flex items-center border-b-4 pt-1 ${n.match(p) ? "border-org" : "border-transparent hover:border-white/30"}`}>{n.label}</Link>
      ))}
    </nav>
  );
}
