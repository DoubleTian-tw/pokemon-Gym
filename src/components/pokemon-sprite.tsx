"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import {
  hexToRgba,
  POKEMON_TYPE_META,
  type PokemonTypeId,
} from "@/lib/pokemon-types";
import { cn } from "@/lib/utils";

export interface PokemonSpriteProps {
  src: string;
  name: string;
  objectPosition?: string;
  accentType?: PokemonTypeId;
  priority?: boolean;
  className?: string;
}

export function PokemonSprite({
  src,
  name,
  objectPosition = "50% 20%",
  accentType,
  priority = false,
  className,
}: PokemonSpriteProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasError = !src || failedSrc === src;
  const accentMeta = accentType ? POKEMON_TYPE_META[accentType] : undefined;

  return (
    <span
      aria-hidden={hasError ? undefined : true}
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className,
      )}
      style={
        accentMeta
          ? {
              background: `radial-gradient(circle at 50% 30%, ${hexToRgba(accentMeta.color, 0.3)}, transparent 72%)`,
            }
          : undefined
      }
    >
      {hasError ? (
        <span
          role="img"
          aria-label={name}
          className="flex size-full items-center justify-center"
        >
          <ImageOff
            className="size-8 text-[var(--ink-secondary)] opacity-55"
            aria-hidden="true"
          />
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- 外部圖鑑圖資採用原生 img + lazy 避免改動 next.config.ts 與消耗 Image Optimization 配額
        <img
          src={src}
          alt={name}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailedSrc(src)}
          className="glass-motion-safe size-full object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ objectPosition }}
        />
      )}
    </span>
  );
}
