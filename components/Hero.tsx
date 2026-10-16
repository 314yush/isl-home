/* eslint-disable @next/next/no-img-element */
import type { Asset } from "@/lib/assets";
export function Silhouette({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 300 300"
      className={`absolute ${className}`}
      style={style}
      fill="currentColor"
      aria-hidden
    >
      <circle cx="160" cy="40" r="26" />
      <path d="M130 72 Q160 64 192 74 L220 140 L200 148 L184 112 L180 170 L214 230 L250 262 L236 278 L190 246 L160 200 L138 250 L96 290 L82 276 L114 236 L128 168 L120 118 L86 152 L70 140 Z" />
      <circle cx="262" cy="276" r="14" />
    </svg>
  );
}
export function Credit({
  a,
  className = "",
}: {
  a: Asset;
  className?: string;
}) {
  return (
    <span
      className={`absolute z-10 text-[9.5px] md:text-[10px] text-white/80 bg-black/45 px-1.5 py-0.5 rounded-sm leading-tight max-w-[70%] truncate ${className}`}
    >
      📷 {a.credit}
      {a.license ? ` · ${a.license}` : ""}
    </span>
  );
}
/** Image-led block: real photo when available (with credit), else duotone gradient + silhouette. */
export function Duotone({
  c1,
  c2,
  img,
  className = "",
  tint = true,
  creditPos = "right-2 top-2",
  children,
}: {
  c1: string;
  c2: string;
  img?: Asset | null;
  className?: string;
  tint?: boolean;
  creditPos?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
    >
      {img ? (
        <>
          <img
            src={img.src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {tint && (
            <div
              className="absolute inset-0 mix-blend-multiply opacity-40"
              style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
            />
          )}
          <Credit a={img} className={creditPos} />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 80% at 75% 30%, rgba(255,255,255,.25), transparent)",
            }}
          />
          <Silhouette className="right-[6%] bottom-0 h-[92%] text-black/45" />
        </>
      )}
      {children}
    </div>
  );
}
