import { clubOr } from "@/lib/clubs";
export default function Badge({ id, name = "", abbr = "", size = 28 }: { id: string; name?: string; abbr?: string; size?: number }) {
  const c = clubOr(id, name, abbr);
  const fs = Math.round(size * (c.mono.length > 3 ? 0.28 : 0.36));
  return (
    <span title={c.name} className="inline-flex items-center justify-center flex-none font-display font-extrabold"
      style={{ width: size, height: size, borderRadius: "30%", background: c.primary, color: c.secondary, fontSize: fs, boxShadow: "inset 0 0 0 2px rgba(255,255,255,.3)" }}>
      {c.mono}
    </span>
  );
}
