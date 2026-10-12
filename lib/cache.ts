import { Redis } from "@upstash/redis";

type Entry<T> = { data: T; fetchedAt: number };
export type HealthRecord = { key: string; lastSuccess: number | null; lastAttempt: number; lastError: string | null; ttl: number };

const g = globalThis as unknown as {
  __appMem?: Map<string, Entry<unknown>>;
  __appHealth?: Map<string, HealthRecord>;
  __appInflight?: Map<string, Promise<unknown>>;
};
const mem = (g.__appMem ??= new Map());
const health = (g.__appHealth ??= new Map());
const inflight = (g.__appInflight ??= new Map());

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
    : null;

export const cacheBackend = redis ? "upstash-redis" : "memory";

export const TTL = { live: 30, matchday: 60, long: 6 * 60 * 60 } as const;

async function readStore<T>(key: string): Promise<Entry<T> | null> {
  const m = mem.get(key) as Entry<T> | undefined;
  if (m) return m;
  if (!redis) return null;
  try {
    const r = await redis.get<Entry<T>>(`mdh:${key}`);
    if (r) mem.set(key, r);
    return r ?? null;
  } catch {
    return null;
  }
}

async function writeStore<T>(key: string, e: Entry<T>) {
  mem.set(key, e);
  if (redis) {
    // keep stale copies around for 7 days so failures can fall back
    try { await redis.set(`mdh:${key}`, e, { ex: 7 * 24 * 3600 }); } catch {}
  }
}

export type Cached<T> = { data: T | null; fetchedAt: number | null; stale: boolean; error: string | null };

/**
 * Stale-while-error cache. Visitors only ever read through this; the provider is
 * called at most once per TTL per key (per instance), and on failure the last good
 * copy is served with stale=true.
 */
export async function cached<T>(key: string, ttlSec: number, fetcher: () => Promise<T>, isEmpty?: (d: T) => boolean): Promise<Cached<T>> {
  const now = Date.now();
  const hit = await readStore<T>(key);
  if (hit && now - hit.fetchedAt < ttlSec * 1000) return { data: hit.data, fetchedAt: hit.fetchedAt, stale: false, error: null };

  let p = inflight.get(key) as Promise<T> | undefined;
  if (!p) {
    p = fetcher();
    inflight.set(key, p);
    p.finally(() => inflight.delete(key)).catch(() => {});
  }
  const rec: HealthRecord = health.get(key) ?? { key, lastSuccess: null, lastAttempt: now, lastError: null, ttl: ttlSec };
  rec.lastAttempt = now;
  rec.ttl = ttlSec;
  try {
    const data = await p;
    if (isEmpty && isEmpty(data) && hit) throw new Error("empty response");
    await writeStore(key, { data, fetchedAt: now });
    rec.lastSuccess = now;
    rec.lastError = null;
    health.set(key, rec);
    return { data, fetchedAt: now, stale: false, error: null };
  } catch (e) {
    rec.lastError = e instanceof Error ? e.message : String(e);
    health.set(key, rec);
    if (hit) return { data: hit.data, fetchedAt: hit.fetchedAt, stale: true, error: rec.lastError };
    return { data: null, fetchedAt: null, stale: true, error: rec.lastError };
  }
}

export function healthSnapshot(): HealthRecord[] {
  return [...health.values()];
}
