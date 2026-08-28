import React from "react";

/** Line glyphs for the expertise cards, keyed by the `glyph` field in the data. */
const PATHS = {
  globe: (
    <>
      <circle cx="20" cy="20" r="15" />
      <path d="M5 20h30M20 5c4.5 5 4.5 25 0 30M20 5c-4.5 5-4.5 25 0 30" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="7" width="34" height="26" rx="1" />
      <path d="M3 13h34M12 20l-4 4 4 4M22 20l4 4-4 4M19 19l-2 10" />
    </>
  ),
  nodes: (
    <>
      <circle cx="9" cy="10" r="3.4" />
      <circle cx="31" cy="10" r="3.4" />
      <circle cx="20" cy="30" r="3.4" />
      <path d="M9 13.4v6a4 4 0 0 0 4 4h1M31 13.4v6a4 4 0 0 1-4 4h-1M20 23.4v-4" />
    </>
  ),
  layout: (
    <>
      <rect x="4" y="6" width="32" height="28" rx="1" />
      <path d="M4 14h32M14 14v20" />
      <rect x="19" y="19" width="12" height="9" rx="1" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="10" width="24" height="20" rx="1" />
      <path d="M27 18l10-6v16l-10-6z" />
      <path d="M9 10v20M21 10v20" opacity=".5" />
    </>
  ),
};

const SkillGlyph = ({ name }) => (
  <div className="glyph" aria-hidden="true">
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.25">
      {PATHS[name] || PATHS.globe}
    </svg>
  </div>
);

export default SkillGlyph;
