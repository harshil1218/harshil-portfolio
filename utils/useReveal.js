import { useEffect } from "react";

/**
 * Fades sections in as they scroll into view. Anything marked .rv starts
 * hidden in CSS, so if the observer is unavailable we reveal everything
 * immediately rather than leaving the page blank.
 */
export default function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll(".rv");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach((el) => el.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
    );

    nodes.forEach((el) => observer.observe(el));

    /* the hero is above the fold — stagger it in straight away */
    document.querySelectorAll(".hero .rv").forEach((el, i) => {
      setTimeout(() => el.classList.add("in"), 120 * i);
    });

    return () => observer.disconnect();
  }, []);
}
