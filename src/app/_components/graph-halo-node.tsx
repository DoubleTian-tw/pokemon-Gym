"use client";

import type { PointerEvent } from "react";
import type { GraphNodeViewModel } from "@/app/_types/gym";
import { PokemonSprite } from "@/components/pokemon-sprite";
import { hexToRgba, POKEMON_TYPE_META } from "@/lib/pokemon-types";
import { cn } from "@/lib/utils";

export interface GraphHaloNodeProps {
  node: GraphNodeViewModel;
  onSelect: (nodeId: string) => void;
  onPointerDown?: (
    event: PointerEvent<HTMLButtonElement>,
    node: GraphNodeViewModel,
  ) => void;
  draggable?: boolean;
  className?: string;
}

export function GraphHaloNode({
  node,
  onSelect,
  onPointerDown,
  draggable = false,
  className,
}: GraphHaloNodeProps) {
  const ringColor = node.isUncovered ? "#ff9f0a" : node.primaryColor;
  const haloAlpha = node.isFocused ? 0.5 : 0.28;
  const haloSpread = node.isFocused ? 14 : 9;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center select-none",
        node.isDimmed && "opacity-15",
        "glass-motion-safe transition-opacity duration-150",
        className,
      )}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onSelect(node.nodeId);
        }}
        onPointerDown={(event) => onPointerDown?.(event, node)}
        aria-label={`${node.pokemon.zhName}${node.side === "attacker" ? `（覆蓋 ${node.coverageCount}/${node.totalDefenders}）` : node.isUncovered ? "（尚未覆蓋）" : ""}`}
        aria-pressed={node.isFocused}
        className={cn(
          "group relative size-12 overflow-hidden rounded-full bg-[var(--graphite-depth)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        )}
        style={{
          border: `2.5px ${node.isUncovered ? "dashed" : "solid"} ${ringColor}`,
          boxShadow: `0 0 ${haloSpread}px ${hexToRgba(ringColor, haloAlpha)}, 0 4px 12px rgba(0, 0, 0, 0.45)`,
        }}
      >
        <PokemonSprite
          src={node.pokemon.spriteUrl}
          name={node.pokemon.zhName}
          accentType={node.pokemon.types[0]}
          objectPosition="50% 25%"
        />
      </button>

      {node.side === "attacker" ? (
        <span
          aria-hidden="true"
          className="glass-tinted pointer-events-none absolute -top-1.5 -right-2 rounded-full px-1.5 py-0.5 text-[10px] leading-none font-bold text-[var(--ink-primary)] tabular-nums"
        >
          {node.coverageCount}/{node.totalDefenders}
        </span>
      ) : null}

      <span
        aria-hidden="true"
        className="glass-tinted pointer-events-none absolute -bottom-1.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-1.5 py-0.5"
      >
        {node.pokemon.types.map((typeId) => (
          <span
            key={typeId}
            className="size-1.5 rounded-full"
            style={{ backgroundColor: POKEMON_TYPE_META[typeId].color }}
          />
        ))}
      </span>

      {node.showName ? (
        <span className="glass-tinted pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[11px] leading-tight font-bold whitespace-nowrap text-[var(--ink-primary)]">
          {node.pokemon.zhName}
          {node.isUncovered ? " !" : ""}
        </span>
      ) : null}

      {node.oppositeBadges.length > 0 ? (
        <div
          className={cn(
            "pointer-events-none absolute top-1/2 flex -translate-y-1/2 flex-col gap-1",
            node.side === "attacker" ? "left-full ml-2" : "right-full mr-2",
          )}
        >
          {node.oppositeBadges.map((badge) => (
            <span
              key={badge.id}
              className={cn(
                "glass-tinted inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] leading-none font-bold whitespace-nowrap text-[var(--ink-primary)] tabular-nums",
                badge.isRisk && "border-[var(--risk-red)]/60",
              )}
            >
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: badge.color }}
              />
              {badge.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
