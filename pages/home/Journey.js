import React from "react";
import data from "@/assets/data/portfolio.json";
import RailLabel from "@/components/common/railLabel/RailLabel";

/** Oldest first — under "How I got here" that reads better than newest first. */
const Journey = () => (
  <section className="sect" id="journey">
    <div className="wrap field">
      <RailLabel index="05" label="Journey" />

      <div>
        <div className="rv sect__intro">
          <h2><span className="ln"><span>How I got here</span></span></h2>
        </div>

        <div className="tl rv">
          {data.journey.map((entry) => (
            <div className="tl__item" key={entry.period}>
              <span className="tl__yr">{entry.period}</span>
              <div className="tl__body">
                <h3>{entry.title}</h3>
                <div className="org">{entry.org}</div>
                {entry.copy.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Journey;
