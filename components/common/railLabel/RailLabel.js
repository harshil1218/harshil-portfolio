import React from "react";

/** The sticky index label that runs down the left rail of every section. */
const RailLabel = ({ index, label }) => (
  <div className="rail-label">
    <span className="tick" />
    <span className="mono">
      {index} &mdash; {label}
    </span>
  </div>
);

export default RailLabel;
