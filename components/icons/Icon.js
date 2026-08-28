import React from "react";

/**
 * References a symbol from <IconSprite />.
 * `name` matches a sprite id without the "i-" prefix, e.g. "react".
 */
const Icon = ({ name, className = "ti" }) => (
  <svg className={className} aria-hidden="true">
    <use href={`#i-${name}`} />
  </svg>
);

export default Icon;
