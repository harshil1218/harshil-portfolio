import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sections } from "@/navigation/NavigationLib";
import Wordmark from "@/components/brand/Wordmark";
import useTheme from "@/utils/useTheme";

const Header = () => {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* highlight whichever section is sitting in the middle of the viewport */
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    Sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className={`nav${stuck ? " stuck" : ""}`}>
        <div className="nav__in">
          <Link href="/#top" className="lockup" aria-label="harshil.dev — home">
            <Wordmark />
          </Link>

          <nav className="nav__links" aria-label="Sections">
            {Sections.map(({ id, index, label }) => (
              <a key={id} href={`#${id}`} className={active === id ? "on" : undefined}>
                <i>{index}</i>
                {label}
              </a>
            ))}
          </nav>

          <div className="nav__side">
            <button
              type="button"
              className="themebtn"
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              <svg className="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
              <svg className="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
              </svg>
            </button>

            <button
              type="button"
              className="menu-btn"
              aria-expanded={open}
              aria-controls="drawer"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="mono">Menu</span>
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer${open ? " open" : ""}`} id="drawer">
        {Sections.map(({ id, index, label }) => (
          <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
            <span>{label}</span>
            <i>{index}</i>
          </a>
        ))}
      </div>
    </>
  );
};

export default Header;
