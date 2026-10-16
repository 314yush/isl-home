"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export const NAV = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  {
    href: "/matches",
    label: "Matches",
    match: (p: string) => p.startsWith("/match"),
  },
  { href: "/table", label: "Table", match: (p: string) => p === "/table" },
  {
    href: "/clubs",
    label: "Clubs",
    match: (p: string) => p.startsWith("/club"),
  },
  { href: "/stats", label: "Stats", match: (p: string) => p === "/stats" },
  {
    href: "/stories",
    label: "Stories",
    match: (p: string) => p.startsWith("/stories"),
  },
];
export default function NavLinks() {
  const p = usePathname();
  return (
    <nav className="site-nav" aria-label="Main navigation">
      {NAV.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          aria-current={n.match(p) ? "page" : undefined}
        >
          {n.label}
        </Link>
      ))}
    </nav>
  );
}
