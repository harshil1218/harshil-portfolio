import React, { useState } from "react";
import Image from "next/image";

/**
 * A live site shown as a browser window. At rest you see the top of the page;
 * on hover the whole screenshot scrolls past.
 *
 * The whole card links out via an absolutely positioned overlay rather than
 * wrapping everything in an <a> — nesting the More button inside a link is
 * invalid markup, and tapping it would navigate instead of expanding.
 */
const ProjectCard = ({ project, wide }) => {
  const [open, setOpen] = useState(false);
  const [w, h] = project.shotSize;

  return (
    <article className={`card rv${wide ? " card--wide" : ""}`}>
      <a
        className="card__link"
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.name} in a new tab`}
      />

      <div className="card__media">
        <div className="shotwrap">
          <div className="shotbar">
            <span className="dots"><i /><i /><i /></span>
            <b>{project.host}</b>
          </div>
          <div className="shotview">
            <Image
              src={project.shot}
              alt={`Full-page screenshot of the ${project.name} site`}
              width={w}
              height={h}
            />
          </div>
        </div>
      </div>

      <div className={`card__body${open ? " open" : ""}`}>
        <div className="chips">
          {project.badges.map((badge, i) => (
            <span className={`chip${i === 0 && project.featured ? " chip--hot" : ""}`} key={badge}>
              {badge}
            </span>
          ))}
        </div>

        <h3>{project.name}</h3>

        <p className="desc">
          {project.copy}
          <button type="button" className="more" onClick={() => setOpen((v) => !v)}>
            {open ? "Less" : "More"}
          </button>
        </p>

        <div className="chips">
          {project.stack.map((tech) => (
            <span className="chip" key={tech}>{tech}</span>
          ))}
        </div>
      </div>

      <div className="card__foot">
        <span className="mono">
          {project.index} &middot; {project.scope}
        </span>
        <a
          className="go mono"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit site <span className="arw">&#8599;</span>
        </a>
      </div>
    </article>
  );
};

export default ProjectCard;
