import { NextResponse } from "next/server";
import { cacheBackend, healthSnapshot } from "@/lib/cache";
import { getAllMatches, getStandings } from "@/lib/data";
import { provider } from "@/lib/providers";

export const dynamic = "force-dynamic";

export async function GET() {
  // touch the core keys so health reflects a real attempt (still cache-guarded)
  await Promise.all([getAllMatches(), getStandings()]);
  const now = Date.now();
  const keys = healthSnapshot().map((h) => {
    const ageSec = h.lastSuccess ? Math.round((now - h.lastSuccess) / 1000) : null;
    return { key: h.key, lastSuccess: h.lastSuccess ? new Date(h.lastSuccess).toISOString() : null, ageSec, ttlSec: h.ttl, stale: ageSec === null || ageSec > h.ttl * 3, lastError: h.lastError };
  });
  const core = keys.filter((k) => ["live", "fixtures", "standings"].includes(k.key));
  const ok = core.length > 0 && core.every((k) => !k.stale);
  const lastSuccess = keys.map((k) => k.lastSuccess).filter(Boolean).sort().pop() ?? null;
  return NextResponse.json({ ok, provider: provider.name, cache: cacheBackend, lastSuccess, keys }, { status: ok ? 200 : 503, headers: { "cache-control": "no-store" } });
}
