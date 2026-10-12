import type { Meta } from "@/lib/data";
import { ago } from "@/lib/time";
export default function StaleBanner({ meta, empty = false }: { meta: Meta; empty?: boolean }) {
  if (!meta.stale && !empty) return null;
  return (
    <div className="bg-[#FFE14D] text-[#2A2200] text-sm font-semibold px-4 md:px-10 py-2.5">
      {meta.fetchedAt
        ? `Live data is delayed: showing what we had ${ago(meta.fetchedAt)}. We'll refresh automatically.`
        : empty && !meta.stale ? "No data yet for this section." : "We couldn't reach our data source right now. Please try again in a minute."}
    </div>
  );
}
