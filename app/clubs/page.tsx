import type { Metadata } from "next";
import Link from "next/link";
import { CLUBS } from "@/lib/clubs";
import Badge from "@/components/Badge";
export const metadata: Metadata = { title: "Clubs" };
export default function Clubs() {
  return (
    <>
      <section className="bg-ind text-white px-4 md:px-10 py-8"><h1 className="d text-[48px] md:text-[72px]">Clubs</h1><p className="opacity-80 text-sm mt-2">13 clubs · 2026-27 season</p></section>
      <main className="max-w-[1200px] mx-auto px-3 md:px-6 pt-5 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {CLUBS.map((c) => (
          <Link key={c.id} href={`/club/${c.slug}`} className="card block hover:-translate-y-0.5 transition">
            <div className="h-28 md:h-36 flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${c.primary} 55%, ${c.secondary} 55%)` }}><Badge id={c.id} size={72} /></div>
            <div className="p-3 border-t-4" style={{ borderColor: c.primary }}><p className="d text-[22px] text-ink">{c.name}</p><p className="text-xs text-mute">{c.city}</p></div>
          </Link>
        ))}
      </main>
    </>
  );
}
