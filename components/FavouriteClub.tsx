"use client";
import { useSyncExternalStore } from "react";
import { CLUBS } from "@/lib/clubs";
import type { Match } from "@/lib/types";
import Badge from "./Badge";
import MatchCard from "./MatchCard";
import Link from "next/link";
import Icon from "./Icon";
const KEY = "maidan-favourite-club";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("maidan-club", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("maidan-club", callback);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}
function save(id: string) {
  try {
    if (id) localStorage.setItem(KEY, id);
    else localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("maidan-club"));
    return true;
  } catch {
    return false;
  }
}
const serverSnapshot = () => "";
export function FollowClub({ id }: { id: string }) {
  const saved = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return (
    <button
      className="btn btn-outline text-sm"
      aria-pressed={saved === id}
      onClick={() => {
        if (!save(saved === id ? "" : id))
          window.alert(
            "Your browser could not save this preference. Please enable local storage to use My club.",
          );
      }}
    >
      <Icon name="heart" size={17} />
      {saved === id ? "Following · remove" : "Follow this club"}
    </button>
  );
}
export default function FavouriteClub({ matches }: { matches: Match[] }) {
  const saved = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const club = CLUBS.find((c) => c.id === saved);
  const mine = matches.filter(
    (m) => m.home.id === saved || m.away.id === saved,
  );
  const upcoming = mine.filter((m) => m.state === "in" || m.state === "pre");
  const results = mine.filter((m) => m.state === "post").reverse();
  return (
    <>
      {club && (
        <section className="mb-12">
          <div className="bg-ind text-white p-7 md:p-10 flex flex-col sm:flex-row sm:items-center gap-6">
            <Badge id={club.id} size={80} />
            <div className="flex-1">
              <p className="eyebrow text-org mb-2">Your club</p>
              <h2 className="d text-5xl">{club.name}</h2>
              <p className="text-white/60 text-sm mt-2">{club.city}</p>
            </div>
            <Link className="btn btn-outline" href={`/club/${club.slug}`}>
              Club hub <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="mt-7 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="d text-3xl mb-4">Next up</h3>
              {upcoming[0] ? (
                <MatchCard match={upcoming[0]} />
              ) : (
                <div className="card p-8 text-sm text-mute">
                  No upcoming match in the feed.
                </div>
              )}
            </div>
            <div>
              <h3 className="d text-3xl mb-4">Latest result</h3>
              {results[0] ? (
                <MatchCard match={results[0]} />
              ) : (
                <div className="card p-8 text-sm text-mute">
                  No completed match in the feed.
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => save("")}
            className="text-xs text-mute underline mt-5"
          >
            Remove favourite club
          </button>
        </section>
      )}
      <div className="section-head">
        <div>
          <h2 className="section-title">
            {club ? "Change your colours" : "Who do you stand with?"}
          </h2>
          <p className="text-sm text-mute mt-3">
            Saved on this device. No sign-up, just football.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {CLUBS.map((c) => (
          <button
            aria-pressed={saved === c.id}
            onClick={() => {
              if (!save(c.id))
                window.alert("Your browser could not save this preference.");
            }}
            key={c.id}
            className={`border p-6 text-left hover:border-ind ${saved === c.id ? "border-ind bg-mint" : "border-line bg-white"}`}
          >
            <div className="flex justify-between items-start">
              <Badge id={c.id} size={45} />
              <span className="text-xs">
                {saved === c.id ? "✓ Selected" : "+"}
              </span>
            </div>
            <h3 className="font-display font-semibold text-2xl mt-5">
              {c.name}
            </h3>
            <p className="text-xs text-mute mt-1">{c.city}</p>
          </button>
        ))}
      </div>
    </>
  );
}
