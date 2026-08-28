import React from "react";
import data from "@/assets/data/portfolio.json";
import DotField from "@/components/common/dotField/DotField";

const Hero = () => {
  const { tagline } = data.profile;

  return (
    <section className="hero">
      <DotField />

      <div className="hero__in">
        <h1 className="rv">
          <span className="ln"><span>Full-stack developer</span></span>
          <span className="ln"><span><em>from</em> UI <em>to</em> API.</span></span>
        </h1>

        <div className="hero__grid">
          <div className="rv">
            <p className="hero__tag">{tagline}</p>
            <div className="hero__cta">
              <a href="#work" className="btn btn--primary">
                View selected work <span className="arw">&#8599;</span>
              </a>
              <a href="#contact" className="btn btn--ghost">
                Get in touch
              </a>
            </div>
          </div>

          <div className="readout rv" aria-hidden="true">
            <div className="row">
              <span className="mono">Where the time goes</span>
              <b>&mdash;</b>
            </div>
            {data.timeSplit.map((row, i) => (
              <React.Fragment key={row.label}>
                <div className="row">
                  <span className="mono">{row.label}</span>
                  <b>{row.value}%</b>
                </div>
                <div className="bar">
                  <i style={{ width: `${row.value}%`, animationDelay: `${i * 0.12}s` }} />
                </div>
              </React.Fragment>
            ))}
            <div className="row readout__total">
              <span className="mono">{data.projects.length} products</span>
              <b className="mono">8 APPS</b>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__foot">
        <div className="inner">
          <div className="scrollcue">
            <span className="mono">Scroll</span>
            <span className="ln2" />
            <span className="mono">01 / About</span>
          </div>
          <span className="mono">{data.profile.location}</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
