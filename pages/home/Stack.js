import React from "react";
import data from "@/assets/data/portfolio.json";
import RailLabel from "@/components/common/railLabel/RailLabel";
import Icon from "@/components/icons/Icon";

const Stack = () => (
  <section className="sect" id="stack">
    <div className="wrap field">
      <RailLabel index="04" label="Stack" />

      <div>
        <div className="rv sect__intro">
          <h2><span className="ln"><span>Tools I build with</span></span></h2>
          <p className="lede">
            Grouped by where they sit in a project, so it&rsquo;s easier to see what I
            use for what.
          </p>
        </div>

        <div className="layers rv">
          {data.stack.map((layer) => (
            <div className={`layer${layer.soft ? " layer--soft" : ""}`} key={layer.layer}>
              <div className="layer__name">
                <span className="sq" />
                <span>{layer.layer}</span>
              </div>
              <div className="tools">
                {layer.tools.map(([label, icon]) => (
                  <span className="tool" key={label}>
                    <Icon name={icon} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Stack;
