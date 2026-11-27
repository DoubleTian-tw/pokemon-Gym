import { POKEMON_TYPE_META, type PokemonTypeId } from "@/lib/pokemon-types";
import { cn } from "@/lib/utils";

export interface TypePillProps {
  type: PokemonTypeId;
  className?: string;
}

export function TypePill({ type, className }: TypePillProps) {
  const meta = POKEMON_TYPE_META[type];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2 py-1 text-[11px] leading-none font-bold whitespace-nowrap",
        className,
      )}
      style={{
        backgroundColor: meta.color,
        color: meta.ink,
      }}
    >
      {meta.zhName}
    </span>
  );
}
