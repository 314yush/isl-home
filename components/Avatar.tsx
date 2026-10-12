/* eslint-disable @next/next/no-img-element */
import { playerPhoto } from "@/lib/assets";
export default function Avatar({ id, name, size = 44, bg = "#2D168F", fg = "#fff" }: { id: string; name: string; size?: number; bg?: string; fg?: string }) {
  const p = playerPhoto(id);
  if (p) return <img src={p.src} alt={name} title={`Photo: ${p.credit} · ${p.license}`} className="rounded-full object-cover object-top flex-none bg-line" style={{ width: size, height: size }} />;
  const ini = name.split(" ").filter(Boolean).map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  return <span className="rounded-full inline-flex items-center justify-center flex-none font-display font-extrabold" style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.38 }}>{ini}</span>;
}
