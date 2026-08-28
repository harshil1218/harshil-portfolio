import React, { useEffect, useRef } from "react";

/**
 * The hero backdrop: a grid of dots that pushes away from the pointer, with a
 * slow waveform running underneath. Colours are read from the CSS custom
 * properties so it follows the theme without duplicating the palette here.
 */
const DotField = () => {
  const canvas = useRef(null);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let width = 0;
    let height = 0;
    let px = -9999;
    let py = -9999;
    let visible = true;
    let frame;
    let dot = "rgba(0,0,0,.2)";
    let hot = "rgba(11,39,240,.95)";
    let wave = "rgba(147,197,253,.7)";

    const readColours = () => {
      const styles = getComputedStyle(document.documentElement);
      dot = styles.getPropertyValue("--dot").trim() || dot;
      hot = styles.getPropertyValue("--dot-hot").trim() || hot;
      wave = styles.getPropertyValue("--wave").trim() || wave;
    };

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = cv.clientWidth;
      height = cv.clientHeight;
      cv.width = Math.round(width * dpr);
      cv.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, width, height);
      const gap = width < 640 ? 26 : 30;
      const reach = 175;

      for (let y = gap; y < height; y += gap) {
        for (let x = gap; x < width + gap; x += gap) {
          const wobble = reduce ? 0 : Math.sin(x * 0.012 + y * 0.018 + t * 0.0011) * 2.4;
          let ox = x;
          let oy = y + wobble;
          let r = 1;
          let colour = dot;

          const dx = px - x;
          const dy = py - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < reach) {
            const f = Math.pow(1 - dist / reach, 2);
            ox = x - dx * f * 0.3;
            oy -= dy * f * 0.3;
            r = 1 + f * 2;
            if (f > 0.4) colour = hot;
          }

          ctx.fillStyle = colour;
          ctx.beginPath();
          ctx.arc(ox, oy, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.beginPath();
      for (let sx = 0; sx <= width; sx += 6) {
        const base = height * 0.72;
        const sy =
          base +
          Math.sin(sx * 0.006 + (reduce ? 0 : t * 0.0008)) * 16 +
          Math.sin(sx * 0.017 + (reduce ? 0 : t * 0.0015)) * 7;
        if (sx === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = wave;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    };

    const loop = (ts) => {
      if (visible) draw(ts);
      frame = requestAnimationFrame(loop);
    };

    size();
    readColours();

    const onResize = () => {
      size();
      if (reduce) draw(0);
    };
    const onMove = (e) => {
      const rect = cv.getBoundingClientRect();
      px = e.clientX - rect.left;
      py = e.clientY - rect.top;
    };
    const onOut = () => {
      px = -9999;
      py = -9999;
    };

    window.addEventListener("resize", onResize);
    if (!coarse) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseout", onOut);
    }

    /* repaint when the palette flips */
    const themeObserver = new MutationObserver(readColours);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let io;
    if (reduce) {
      draw(0);
    } else {
      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver((entries) => {
          visible = entries[0].isIntersecting;
        });
        io.observe(cv);
      }
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onOut);
      themeObserver.disconnect();
      if (io) io.disconnect();
    };
  }, []);

  return <canvas id="field" ref={canvas} aria-hidden="true" />;
};

export default DotField;
