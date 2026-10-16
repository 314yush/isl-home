"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { CLUBS } from "@/lib/clubs";
import { heroFor } from "@/lib/assets";
import Badge from "./Badge";
import Icon from "./Icon";
export default function ClubDirectory() {
  const [search, setSearch] = useState("");
  const clubs = CLUBS.filter((c) =>
    `${c.name} ${c.city}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-5 mb-8 items-start sm:items-center">
        <p className="text-sm text-mute" aria-live="polite">
          {clubs.length} clubs. Countless reasons to believe.
        </p>
        <label className="relative w-full sm:w-80">
          <span className="sr-only">Find a club or city</span>
          <input
            className="filter w-full pr-10"
            type="search"
            placeholder="Find a club or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute right-3 top-3.5 pointer-events-none">
            <Icon name="search" size={18} />
          </span>
        </label>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((c) => (
          <Link
            href={`/club/${c.slug}`}
            key={c.id}
            className="group bg-white border border-line overflow-hidden"
          >
            <div
              className="h-44 relative overflow-hidden"
              style={{ background: c.primary }}
            >
              {heroFor(c.slug) && (
                <img
                  src={heroFor(c.slug)!.src}
                  alt=""
                  className="w-full h-full object-cover opacity-65 group-hover:scale-105 transition duration-700"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute left-5 bottom-4 text-white eyebrow">
                {c.city}
              </span>
            </div>
            <div
              className="p-6 relative border-t-4"
              style={{ borderColor: c.primary }}
            >
              <div className="absolute -top-10 right-5 bg-white w-20 h-20 flex items-center justify-center rounded-full border border-line">
                <Badge id={c.id} size={50} />
              </div>
              <p className="eyebrow text-mute mb-2">{c.mono}</p>
              <h2 className="d text-[32px] pr-8">{c.name}</h2>
              <div className="flex justify-between text-xs font-semibold mt-7 pt-4 border-t border-line">
                <span>Explore club</span>
                <Icon name="arrow" size={17} />
              </div>
            </div>
          </Link>
        ))}
      </div>
      {!clubs.length && (
        <div className="empty-state">
          <h2>No clubs found</h2>
          <button className="btn btn-dark" onClick={() => setSearch("")}>
            Clear search
          </button>
        </div>
      )}
    </>
  );
}
