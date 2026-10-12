import type { LineupPlayer } from "@/lib/types";

const ROWS: [RegExp, number][] = [[/^G/, 0], [/^(L|R)?WB$|^(L|R)B$|^CD|^CB|^D$|^D-/, 1], [/^DM|^CDM/, 2], [/^(L|R)M$|^CM|^M$|^M-/, 3], [/^AM/, 4], [/^(L|R)?F$|^CF|^ST|^(L|R)W$|^F-/, 5]];
const row = (p: string) => ROWS.find(([r]) => r.test(p))?.[1] ?? 3;
const lat = (p: string) => (/^L/.test(p) ? 0 : /-L$/.test(p) ? 1 : /-R$/.test(p) ? 3 : /^R/.test(p) ? 4 : 2);

export type Placed = LineupPlayer & { t: number; l: number };
export function place(players: LineupPlayer[]): Placed[] {
  const xi = players.filter((p) => p.starter);
  const groups = new Map<number, LineupPlayer[]>();
  for (const p of xi) { const r = row(p.position); groups.set(r, [...(groups.get(r) ?? []), p]); }
  const keys = [...groups.keys()].sort((a, b) => a - b);
  const out: Placed[] = [];
  keys.forEach((k, i) => {
    const ps = groups.get(k)!.sort((a, b) => lat(a.position) - lat(b.position));
    const t = keys.length > 1 ? i / (keys.length - 1) : 0;
    ps.forEach((p, j) => out.push({ ...p, t, l: ps.length === 1 ? 50 : 12 + (76 * j) / (ps.length - 1) }));
  });
  return out;
}
const surname = (n: string) => { const s = n.split(" "); return s.length > 1 ? s.slice(-1)[0] : n; };

function Dot({ p, x, y, bg, fg }: { p: Placed; x: number; y: number; bg: string; fg: string }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 text-center w-[76px] md:w-[90px]" style={{ left: `${x}%`, top: `${y}%` }}>
      <span className="inline-flex w-7 h-7 md:w-[30px] md:h-[30px] rounded-full items-center justify-center font-extrabold text-[12px] md:text-[13px] border-2 border-white" style={{ background: bg, color: fg }}>{p.number}</span>
      <p className="text-[10px] md:text-[11px] text-white font-semibold mt-0.5 leading-tight [text-shadow:0_1px_2px_rgba(0,0,0,.6)] truncate">{surname(p.name)}{p.subbedOut ? " ↓" : ""}</p>
    </div>
  );
}

export default function Pitch({ home, away, hc, ac }: { home: LineupPlayer[]; away: LineupPlayer[]; hc: [string, string]; ac: [string, string] }) {
  const H = place(home), A = place(away);
  const line = "absolute border-white/55";
  return (
    <>
      {/* desktop: horizontal, home attacking right */}
      <div className="hidden md:block relative h-[440px] rounded-[10px] overflow-hidden" style={{ background: "repeating-linear-gradient(90deg,#1F8A4C 0 9.09%,#22964F 9.09% 18.18%)" }}>
        <div className={`${line} inset-4 border-2`} /><div className={`${line} left-1/2 top-4 bottom-4 border-l-2`} />
        <div className={`${line} left-1/2 top-1/2 w-[110px] h-[110px] -m-[55px] border-2 rounded-full`} />
        <div className={`${line} left-4 top-[30%] bottom-[30%] w-[13%] border-2 border-l-0`} /><div className={`${line} right-4 top-[30%] bottom-[30%] w-[13%] border-2 border-r-0`} />
        {H.map((p) => <Dot key={"h" + p.number + p.name} p={p} x={6 + p.t * 39} y={p.l} bg={hc[0]} fg={hc[1]} />)}
        {A.map((p) => <Dot key={"a" + p.number + p.name} p={p} x={94 - p.t * 39} y={100 - p.l} bg={ac[0]} fg={ac[1]} />)}
      </div>
      {/* mobile: vertical, home attacking down */}
      <div className="md:hidden relative h-[620px] rounded-[10px] overflow-hidden" style={{ background: "repeating-linear-gradient(0deg,#1F8A4C 0 9.09%,#22964F 9.09% 18.18%)" }}>
        <div className={`${line} inset-3 border-2`} /><div className={`${line} top-1/2 left-3 right-3 border-t-2`} />
        <div className={`${line} left-1/2 top-1/2 w-[90px] h-[90px] -m-[45px] border-2 rounded-full`} />
        {H.map((p) => <Dot key={"h" + p.number + p.name} p={p} y={5 + p.t * 39} x={100 - p.l} bg={hc[0]} fg={hc[1]} />)}
        {A.map((p) => <Dot key={"a" + p.number + p.name} p={p} y={95 - p.t * 39} x={p.l} bg={ac[0]} fg={ac[1]} />)}
      </div>
    </>
  );
}
