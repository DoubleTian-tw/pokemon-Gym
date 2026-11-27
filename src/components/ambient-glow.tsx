import { DEFAULT_AMBIENT_COLORS, hexToRgba } from "@/lib/pokemon-types";
import { cn } from "@/lib/utils";

export interface AmbientGlowProps {
  colors?: readonly [string, string, string];
  className?: string;
}

export function AmbientGlow({
  colors = DEFAULT_AMBIENT_COLORS,
  className,
}: AmbientGlowProps) {
  const [c1, c2, c3] = colors;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden [contain:strict]",
        className,
      )}
    >
      <div
        className="absolute -top-24 -left-20 size-[340px] rounded-full transition-[background] duration-500 ease-out"
        style={{
          background: `radial-gradient(circle, ${hexToRgba(c1, 0.28)} 0%, ${hexToRgba(c1, 0.11)} 42%, transparent 72%)`,
        }}
      />
      <div
        className="absolute top-28 -right-24 size-[360px] rounded-full transition-[background] duration-500 ease-out"
        style={{
          background: `radial-gradient(circle, ${hexToRgba(c2, 0.24)} 0%, ${hexToRgba(c2, 0.09)} 42%, transparent 72%)`,
        }}
      />
      <div
        className="absolute -bottom-24 left-[18%] size-[320px] rounded-full transition-[background] duration-500 ease-out"
        style={{
          background: `radial-gradient(circle, ${hexToRgba(c3, 0.2)} 0%, ${hexToRgba(c3, 0.08)} 42%, transparent 72%)`,
        }}
      />
    </div>
  );
}
