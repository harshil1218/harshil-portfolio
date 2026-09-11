import React, { useState } from "react";
import Image from "next/image";

/**
 * A live site shown as a browser window. At rest you see the top of the page;
 * on hover the whole screenshot scrolls past.
 *
 * Only the "Visit site" link in the footer navigates — the card body stays
 * inert so text can be selected and More can expand without surprises.
 */
const ProjectCard = ({ project, wide }) => {
  const [open, setOpen] = useState(false);

  return (
    <article className={`card rv${wide ? " card--wide" : ""}`}>
      <div className="card__media">
        {project.confidential ? (
          <div className="nda">
            <div className="plate" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
              <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.8v2" />
            </svg>
            <span className="mono">Confidential &middot; no public link or screenshots</span>
          </div>
        ) : (
          <div className="shotwrap">
            <div className="shotbar">
              <span className="dots"><i /><i /><i /></span>
              <b>{project.host}</b>
            </div>
            <div className="shotview">
              <Image
                src={project.shot}
                alt={`Full-page screenshot of the ${project.name} site`}
                width={project.shotSize[0]}
                height={project.shotSize[1]}
              />
            </div>
          </div>
        )}
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
        {project.confidential ? (
          <span className="go go--off mono">Private &middot; NDA</span>
        ) : (
          <a
            className="go mono"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit site <span className="arw">&#8599;</span>
          </a>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
