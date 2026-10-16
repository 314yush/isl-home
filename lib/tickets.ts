import tickets from "@/data/tickets.json";
import { istDate } from "./time";
import type { Match } from "./types";
type Listing = {
  homeId: string;
  awayId: string;
  date: string;
  url: string;
  checkedAt: string;
};
const listings: Record<string, Listing> = tickets.matches;
export type MatchTicket = {
  url: string;
  direct: boolean;
  label: string;
  checkedAt?: string;
};
export function ticketFor(m: Match, now = Date.now()): MatchTicket | null {
  if (
    m.state !== "pre" ||
    !Number.isFinite(Date.parse(m.kickoff)) ||
    Date.parse(m.kickoff) <= now
  )
    return null;
  const t = listings[m.id];
  if (
    t &&
    t.homeId === m.home.id &&
    t.awayId === m.away.id &&
    t.date === istDate(m.kickoff)
  )
    return {
      url: t.url,
      direct: true,
      label: "Tickets on District",
      checkedAt: t.checkedAt,
    };
  return {
    url: `https://www.district.in/search?q=${encodeURIComponent(`${m.home.name} vs ${m.away.name}`)}`,
    direct: false,
    label: "Find this match on District",
  };
}
