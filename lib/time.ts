export const TZ = "Asia/Kolkata";
const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-IN", { timeZone: TZ, ...o });
export const fmtTime = (iso: string) => f({ hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));
export const fmtDay = (iso: string) => f({ weekday: "short", day: "numeric", month: "short" }).format(new Date(iso));
export const fmtDayLong = (iso: string) => f({ weekday: "long", day: "numeric", month: "long" }).format(new Date(iso));
export const fmtDateTime = (iso: string) => `${fmtDay(iso)}, ${fmtTime(iso)} IST`;
/** YYYY-MM-DD in IST */
export const istDate = (iso: string | Date) => f({ year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso)).split("/").reverse().join("-");
/** Monday (IST) of the week containing the date, as YYYY-MM-DD */
export function istWeekStart(iso: string | Date): string {
  const d = new Date(istDate(iso) + "T00:00:00Z");
  const dow = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dow);
  return d.toISOString().slice(0, 10);
}
export const ago = (ms: number) => {
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 90) return `${s}s ago`;
  if (s < 5400) return `${Math.round(s / 60)} min ago`;
  return `${Math.round(s / 3600)} h ago`;
};
