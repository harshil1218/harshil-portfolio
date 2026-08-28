import React from "react";
import data from "@/assets/data/portfolio.json";
import Icon from "@/components/icons/Icon";

/** Doubled so the marquee can loop seamlessly at -50%. */
const Ticker = () => {
  const run = [...data.ticker, ...data.ticker];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {run.map(([label, icon], i) => (
          <span key={`${label}-${i}`}>
            <Icon name={icon} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
