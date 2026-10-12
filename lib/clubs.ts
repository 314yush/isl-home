/** Hand-maintained club identity (no crests: monograms + colours only). Keyed by provider team id. */
export interface Club { id: string; slug: string; name: string; short: string; mono: string; primary: string; secondary: string; city: string; tsdb: string[] }
export const CLUBS: Club[] = [
  { id: "18851", slug: "bengaluru-fc", name: "Bengaluru FC", short: "Bengaluru", mono: "BFC", primary: "#123C8C", secondary: "#FFFFFF", city: "Bengaluru", tsdb: ["Bengaluru"] },
  { id: "18000", slug: "chennaiyin-fc", name: "Chennaiyin FC", short: "Chennaiyin", mono: "CFC", primary: "#1F4FA0", secondary: "#F2C200", city: "Chennai", tsdb: ["Chennaiyin"] },
  { id: "8896", slug: "churchill-brothers", name: "Churchill Brothers", short: "Churchill", mono: "CBSC", primary: "#B3122E", secondary: "#FFD54A", city: "Goa", tsdb: ["Churchill"] },
  { id: "18003", slug: "fc-goa", name: "FC Goa", short: "Goa", mono: "FCG", primary: "#F26A21", secondary: "#1B3F8F", city: "Margao", tsdb: ["Goa"] },
  { id: "22069", slug: "inter-kashi", name: "Inter Kashi", short: "Inter Kashi", mono: "IKFC", primary: "#0A2F6B", secondary: "#E2B23A", city: "Varanasi", tsdb: ["Kashi"] },
  { id: "17997", slug: "kerala-blasters", name: "Kerala Blasters", short: "Kerala", mono: "KBFC", primary: "#F4C300", secondary: "#1D3E8A", city: "Kochi", tsdb: ["Kerala"] },
  { id: "20774", slug: "mohun-bagan-sg", name: "Mohun Bagan SG", short: "Mohun Bagan", mono: "MBSG", primary: "#0E5E3A", secondary: "#F4E9D8", city: "Kolkata", tsdb: ["Mohun"] },
  { id: "18002", slug: "mumbai-city", name: "Mumbai City", short: "Mumbai City", mono: "MCFC", primary: "#58A6DD", secondary: "#0B1F3A", city: "Mumbai", tsdb: ["Mumbai"] },
  { id: "18004", slug: "northeast-united", name: "NorthEast United", short: "NorthEast", mono: "NEU", primary: "#111111", secondary: "#F5D000", city: "Guwahati", tsdb: ["NorthEast", "North East"] },
  { id: "17998", slug: "odisha-fc", name: "Odisha FC", short: "Odisha", mono: "OFC", primary: "#5B2C83", secondary: "#F2C200", city: "Bhubaneswar", tsdb: ["Odisha"] },
  { id: "18894", slug: "punjab-fc", name: "Punjab FC", short: "Punjab", mono: "PFC", primary: "#B5121B", secondary: "#F1E3C5", city: "Mohali", tsdb: ["Punjab"] },
  { id: "8897", slug: "east-bengal", name: "East Bengal", short: "East Bengal", mono: "EB", primary: "#C8102E", secondary: "#F2C200", city: "Kolkata", tsdb: ["East Bengal"] },
  { id: "131703", slug: "sc-delhi", name: "SC Delhi", short: "SC Delhi", mono: "SCD", primary: "#0B2545", secondary: "#E63946", city: "Delhi", tsdb: ["Delhi"] },
];
export const clubById = (id: string) => CLUBS.find((c) => c.id === id);
export const clubBySlug = (s: string) => CLUBS.find((c) => c.slug === s);
export function clubOr(id: string, name: string, abbr: string): Club {
  return clubById(id) ?? { id, slug: id, name, short: name, mono: abbr.slice(0, 4), primary: "#2D168F", secondary: "#FFFFFF", city: "", tsdb: [name] };
}
