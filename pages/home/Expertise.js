import React from "react";
import data from "@/assets/data/portfolio.json";
import RailLabel from "@/components/common/railLabel/RailLabel";
import SkillGlyph from "@/components/common/skillGlyph/SkillGlyph";
import LevelMeter from "@/components/common/levelMeter/LevelMeter";

const LEGEND = [
  { level: 4, name: "Core", text: "I use it every day" },
  { level: 3, name: "Working", text: "I can build with it alone" },
  { level: 2, name: "Intermediate", text: "I get by, still learning" },
];

const Expertise = () => (
  <section className="sect" id="skills">
    <div className="wrap field">
      <RailLabel index="02" label="Expertise" />

      <div>
        <div className="rv sect__intro">
          <h2>
            <span className="ln"><span>What I actually do</span></span>
          </h2>
          <p className="lede">
            I&rsquo;ve rated these honestly. Some I use every day, some I&rsquo;m comfortable
            with on my own, and one I&rsquo;m still getting better at.
          </p>
        </div>

        <div className="skills rv">
          {data.expertise.map((skill) => (
            <article className="skill" key={skill.title}>
              <SkillGlyph name={skill.glyph} />
              <h3>{skill.title}</h3>
              <p>{skill.copy}</p>
              <div className="chips">
                {skill.tags.map((tag) => (
                  <span className="chip" key={tag}>{tag}</span>
                ))}
              </div>
              <LevelMeter level={skill.level} label={skill.levelLabel} />
            </article>
          ))}

          <article className="skill skill--note">
            <h3>Reading the markers</h3>
            <div className="legend">
              {LEGEND.map((row) => (
                <div key={row.level}>
                  <LevelMeter level={row.level} />
                  <span>
                    <b>{row.name}</b> {row.text}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
);

export default Expertise;
