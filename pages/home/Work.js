import React from "react";
import data from "@/assets/data/portfolio.json";
import RailLabel from "@/components/common/railLabel/RailLabel";
import ProjectCard from "@/components/projectCard/ProjectCard";

const Work = () => {
  const featured = data.projects.find((p) => p.featured);
  const rest = data.projects.filter((p) => !p.featured && !p.confidential);
  const confidential = data.projects.filter((p) => p.confidential);

  return (
    <section className="sect" id="work">
      <div className="wrap field">
        <RailLabel index="03" label="Work" />

        <div>
          <div className="proj-head rv">
            <div>
              <h2><span className="ln"><span>Selected projects</span></span></h2>
              <p className="lede">
                Five projects, ten apps between them. Two are full builds with a
                storefront, an admin panel and an API behind both, and one is
                confidential client work.
              </p>
            </div>
          </div>

          <div className="projects">
            {featured ? <ProjectCard project={featured} wide /> : null}
            <div className="trio">
              {rest.map((project) => (
                <ProjectCard project={project} key={project.name} />
              ))}
            </div>
            {confidential.map((project) => (
              <ProjectCard project={project} wide key={project.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;
