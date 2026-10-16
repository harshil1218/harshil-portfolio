import React, { useId } from "react";

/**
 * The Branch mark: a lowercase h drawn as a Git commit graph — the main line,
 * and a branch splitting off it. Ink parts use currentColor and the gradient
 * reads the brand tokens, so both follow the light/dark theme.
 */
const BrandMark = ({ className = "brandmark" }) => {
  const id = `bm-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg className={className} viewBox="10 4 44 56" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="4" y1="60" x2="60" y2="4">
          <stop offset="0" style={{ stopColor: "var(--brand-1)" }} />
          <stop offset="1" style={{ stopColor: "var(--brand-2)" }} />
        </linearGradient>
      </defs>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.5">
        <path d="M20 12 V52" stroke="currentColor" />
        <path d="M20 28 C20 37 44 33 44 43 V52" stroke={`url(#${id})`} />
      </g>
      <circle cx="20" cy="12" r="5.5" fill="currentColor" />
      <circle cx="20" cy="52" r="5.5" fill="currentColor" />
      <circle cx="44" cy="52" r="5.5" fill={`url(#${id})`} />
    </svg>
  );
};

export default BrandMark;
