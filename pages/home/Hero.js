import React from "react";
import data from "@/assets/data/portfolio.json";
import DotField from "@/components/common/dotField/DotField";
import StackScene, { SCENE_IN_HERO } from "@/components/common/stackScene/StackScene";
import useMediaQuery from "@/utils/useMediaQuery";

/**
 * Copy on the left, and on laptop the 3D stack on the right (55 / 45).
 * Below laptop width the stack moves to its own band under the ticker.
 */
const Hero = () => {
  const { tagline } = data.profile;
  const sceneHere = useMediaQuery(SCENE_IN_HERO);

  /* the readout splits into two columns from tablet up, two rows in each */
  const split = (row, i) => (
    <React.Fragment key={row.label}>
      <div className="row">
        <span className="mono">{row.label}</span>
        <b>{row.value}%</b>
      </div>
      <div className="bar">
        <i style={{ width: `${row.value}%`, animationDelay: `${i * 0.12}s` }} />
      </div>
    </React.Fragment>
  );

  return (
    <section className="hero">
      <DotField />

      <div className="hero__in">
        <div className="hero__copy">
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
              <div className="row readout__head">
                <span className="mono">Where my time goes &middot; last 2 months</span>
                <b>&mdash;</b>
              </div>
              <div className="readout__col">{data.timeSplit.slice(0, 2).map(split)}</div>
              <div className="readout__col">{data.timeSplit.slice(2).map((row, i) => split(row, i + 2))}</div>
              <div className="row readout__total">
                <span className="mono">{data.projects.length} projects</span>
                <b className="mono">10 APPS</b>
              </div>
            </div>
          </div>
        </div>

        <div className="hero__stage">{sceneHere ? <StackScene placement="hero" /> : null}</div>
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
