import React, { useEffect, useRef } from "react";

const SNIPPETS = [
  "</>", "const", "{ }", "=>", "01", "101", "npm", "git", "fn()", "[]",
  "0x1F", "./", "<div>", "async", "--var", "return", "404", "()=>",
  "export", "let", "props", "null", "1010", "git push", "&&", "#0B27F0",
  "map()", "useState", "...", "div>",
];

const LIFETIME = 1040;
const THROTTLE = 70;
const MAX_LIVE = 34;

/**
 * Tiny code fragments that trail the pointer. The native cursor is left alone.
 *
 * Both mouse and touch are wired unconditionally — deciding once at mount
 * which kind of device this is gets it wrong on hybrids and on any viewport
 * that changes later. Touch screens have no hovering pointer, so they also
 * get a slow ambient drizzle; that check is re-evaluated on every tick.
 */
const CodeCursor = () => {
  const layer = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const node = layer.current;
    if (!node) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 3;
    let prevX = mx;
    let prevY = my;
    let lastSpawn = 0;
    let live = 0;
    let moved = false;
    let frame;

    const emit = (x, y) => {
      if (live > MAX_LIVE) return;
      const frag = document.createElement("span");
      frag.className = "frag" + (Math.random() < 0.3 ? " acc" : "");
      frag.textContent = SNIPPETS[(Math.random() * SNIPPETS.length) | 0];

      const angle = Math.random() * Math.PI * 2;
      const radius = 14 + Math.random() * 44;
      frag.style.left = `${x + Math.cos(angle) * radius}px`;
      frag.style.top = `${y + Math.sin(angle) * radius}px`;
      frag.style.setProperty("--dx", `${(Math.cos(angle) * 15).toFixed(1)}px`);
      frag.style.setProperty("--dy", `${(Math.sin(angle) * 15 - 7).toFixed(1)}px`);

      node.appendChild(frag);
      live += 1;
      setTimeout(() => {
        if (frag.parentNode) {
          frag.parentNode.removeChild(frag);
          live -= 1;
        }
      }, LIFETIME);
    };

    const setPoint = (x, y) => {
      mx = x;
      my = y;
      moved = true;
    };

    const onMouse = (e) => setPoint(e.clientX, e.clientY);
    const onTouch = (e) => {
      const touch = e.touches && e.touches[0];
      if (touch) setPoint(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    const ambient = setInterval(() => {
      if (document.hidden) return;
      if (!window.matchMedia("(pointer: coarse)").matches) return;
      emit(
        40 + Math.random() * (window.innerWidth - 80),
        90 + Math.random() * (window.innerHeight - 180)
      );
    }, 820);

    const tick = (now) => {
      const speed = Math.abs(mx - prevX) + Math.abs(my - prevY);
      if (speed > 1.5 && moved && now - lastSpawn >= THROTTLE) {
        lastSpawn = now;
        emit(mx, my);
        if (Math.random() < 0.45) emit(mx, my);
      }
      prevX = mx;
      prevY = my;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(ambient);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return <div className="cursor-layer" ref={layer} aria-hidden="true" />;
};

export default CodeCursor;
