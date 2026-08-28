import React from "react";

/** Four segments — an honest depth marker rather than a fake percentage. */
const LevelMeter = ({ level, label }) => (
  <span className="lvl">
    <span className="lvl__bars" aria-hidden="true">
      {[1, 2, 3, 4].map((n) => (
        <i key={n} className={n <= level ? "on" : undefined} />
      ))}
    </span>
    {label ? <span>{label}</span> : null}
  </span>
);

export default LevelMeter;
