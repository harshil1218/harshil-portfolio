import React from "react";
import Image from "next/image";
import data from "@/assets/data/portfolio.json";
import RailLabel from "@/components/common/railLabel/RailLabel";

const About = () => {
  const [lead, ...rest] = data.about;

  return (
    <section className="sect about" id="about">
      <div className="wrap field">
        <RailLabel index="01" label="About" />

        <div className="about__grid">
          <div className="rv">
            <h2>
              <span className="ln"><span>I&rsquo;d rather understand</span></span>
              <span className="ln"><span>the whole thing.</span></span>
            </h2>

            <p className="lede">{lead}</p>
            {rest.map((para, i) => (
              <p className="quiet body-max" key={i}>{para}</p>
            ))}

            <div className="statrow">
              {data.stats.map((stat) => (
                <div key={stat.label}>
                  <b>{stat.value}</b>
                  <span className="mono">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="portrait rv">
            <div className="portrait__box">
              <Image
                src={data.profile.portrait}
                alt="Harshil at his desk"
                width={1000}
                height={1250}
                priority
              />
            </div>
            <div className="portrait__foot">
              <span className="mono">{data.profile.name}</span>
              <span className="mono">{data.profile.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
