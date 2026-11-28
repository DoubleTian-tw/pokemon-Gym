"use client";

const CYAN_SLATE_COLORS = {
  quadIdle: "#22d3ee",
  quadFocus: "#67e8f9",
  doubleIdle: "#64748b",
  doubleFocus: "#cbd5e1",
} as const;

export function GraphSvgDefs({ prefix }: { prefix: string }) {
  return (
    <defs>
      <linearGradient
        id={`${prefix}-counter-double-idle`}
        gradientUnits="userSpaceOnUse"
        x1="56"
        y1="0"
        x2="284"
        y2="0"
      >
        <stop
          offset="0%"
          stopColor={CYAN_SLATE_COLORS.quadIdle}
          stopOpacity="0.16"
        />
        <stop
          offset="100%"
          stopColor={CYAN_SLATE_COLORS.quadIdle}
          stopOpacity="0.56"
        />
      </linearGradient>
      <linearGradient
        id={`${prefix}-counter-double-focus`}
        gradientUnits="userSpaceOnUse"
        x1="56"
        y1="0"
        x2="284"
        y2="0"
      >
        <stop
          offset="0%"
          stopColor={CYAN_SLATE_COLORS.quadFocus}
          stopOpacity="0.3"
        />
        <stop
          offset="100%"
          stopColor={CYAN_SLATE_COLORS.quadFocus}
          stopOpacity="1"
        />
      </linearGradient>
      <linearGradient
        id={`${prefix}-counter-effective-idle`}
        gradientUnits="userSpaceOnUse"
        x1="56"
        y1="0"
        x2="284"
        y2="0"
      >
        <stop
          offset="0%"
          stopColor={CYAN_SLATE_COLORS.doubleIdle}
          stopOpacity="0.08"
        />
        <stop
          offset="100%"
          stopColor={CYAN_SLATE_COLORS.doubleIdle}
          stopOpacity="0.28"
        />
      </linearGradient>
      <linearGradient
        id={`${prefix}-counter-effective-focus`}
        gradientUnits="userSpaceOnUse"
        x1="56"
        y1="0"
        x2="284"
        y2="0"
      >
        <stop
          offset="0%"
          stopColor={CYAN_SLATE_COLORS.doubleFocus}
          stopOpacity="0.22"
        />
        <stop
          offset="100%"
          stopColor={CYAN_SLATE_COLORS.doubleFocus}
          stopOpacity="0.86"
        />
      </linearGradient>
      <linearGradient
        id={`${prefix}-risk-idle`}
        gradientUnits="userSpaceOnUse"
        x1="284"
        y1="0"
        x2="56"
        y2="0"
      >
        <stop offset="0%" stopColor="#ff453a" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#ff453a" stopOpacity="0.28" />
      </linearGradient>
      <linearGradient
        id={`${prefix}-risk-focus`}
        gradientUnits="userSpaceOnUse"
        x1="284"
        y1="0"
        x2="56"
        y2="0"
      >
        <stop offset="0%" stopColor="#ff453a" stopOpacity="0.24" />
        <stop offset="100%" stopColor="#ff453a" stopOpacity="0.96" />
      </linearGradient>

      <marker
        id={`${prefix}-chevron-counter-double`}
        viewBox="0 0 10 10"
        refX="7.5"
        refY="5"
        markerWidth="5.5"
        markerHeight="5.5"
        orient="auto-start-reverse"
      >
        <path
          d="M 1.5 1.5 L 8 5 L 1.5 8.5"
          fill="none"
          stroke={CYAN_SLATE_COLORS.quadFocus}
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </marker>
      <marker
        id={`${prefix}-chevron-counter-effective`}
        viewBox="0 0 10 10"
        refX="7.5"
        refY="5"
        markerWidth="5.5"
        markerHeight="5.5"
        orient="auto-start-reverse"
      >
        <path
          d="M 1.5 1.5 L 8 5 L 1.5 8.5"
          fill="none"
          stroke={CYAN_SLATE_COLORS.doubleFocus}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </marker>
      <marker
        id={`${prefix}-chevron-risk`}
        viewBox="0 0 10 10"
        refX="7.5"
        refY="5"
        markerWidth="5.5"
        markerHeight="5.5"
        orient="auto-start-reverse"
      >
        <path
          d="M 1.5 1.5 L 8 5 L 1.5 8.5"
          fill="none"
          stroke="#ff453a"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </marker>
    </defs>
  );
}
