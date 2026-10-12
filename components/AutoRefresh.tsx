"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
/** Re-renders the server component on an interval (server cache absorbs the load). */
export default function AutoRefresh({ seconds = 30, label = true }: { seconds?: number; label?: boolean }) {
  const r = useRouter();
  useEffect(() => { const t = setInterval(() => r.refresh(), seconds * 1000); return () => clearInterval(t); }, [r, seconds]);
  return label ? <span className="text-xs opacity-75">Auto-updating every {seconds}s</span> : null;
}
