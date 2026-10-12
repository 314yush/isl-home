/* eslint-disable @next/next/no-img-element */
import { LEAGUE_LOGO } from "@/lib/assets";
export default function LeagueLogo({ size = 40 }: { size?: number }) {
  if (!LEAGUE_LOGO) return null;
  return <span className="bg-white rounded-md p-0.5 inline-flex flex-none"><img src={LEAGUE_LOGO.src} alt="Indian Super League logo" style={{ height: size, width: "auto" }} /></span>;
}
