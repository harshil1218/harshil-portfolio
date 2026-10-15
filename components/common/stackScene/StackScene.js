import React, { useEffect, useRef } from "react";
import data from "@/assets/data/portfolio.json";

/** Laptop and up: the scene sits in the hero. Below that it gets its own band. */
export const SCENE_IN_HERO = "(min-width: 1180px)";

const { products, collections, flows: FLOWS, docs: DOCS } = data.stackScene;

/* world geometry, in CSS px before the scene is scaled to fit */
const T = 12; // slab thickness
const GAP = 104; // resting distance between layers
const REVEAL = 70; // how far the layers above the busy one lift
const INTRO_END = 1500; // the layers finish building before the first request
const BASE = { yaw: -38, pitch: 56 };

/* where each request starts on the storefront */
const TRIGGER = {
  products: ".refresh",
  login: ".ui-signin",
  cart: ".ui-card .add",
  orders: ".ui-checkout",
};

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutBack = (t) => 1 + 2.25 * Math.pow(t - 1, 3) + 1.25 * Math.pow(t - 1, 2);

/* a tiny highlighter for the code and the documents: strings, keywords, numbers, calls */
const highlight = (src) =>
  src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(
      /("[^"]*")|\b(const|await|async|return|if|true|false)\b|\b(\d+)\b|([A-Za-z_$][\w$]*)(?=\()/g,
      (m, str, kw, num, fn) =>
        str
          ? `<span class="t-s">${str}</span>`
          : kw
          ? `<span class="t-k">${kw}</span>`
          : num
          ? `<span class="t-n">${num}</span>`
          : `<span class="t-f">${fn}</span>`
    );

/* a layer: four edges give it thickness, the face sits on top */
const Slab = ({ i, children }) => (
  <div className="slab" data-i={i}>
    <div className="edge n" />
    <div className="edge s" />
    <div className="edge w" />
    <div className="edge e" />
    {children}
  </div>
);

/* the label beside each layer — a billboard, so it always faces the viewer */
const Tag = ({ i, index, label }) => (
  <div className="bb tag" data-i={i}>
    <div className="tag__in">
      <span className="tag__txt">
        <span className="mono">{index}</span>
        <b>{label}</b>
      </span>
      <span className="tag__lead" />
    </div>
  </div>
);

/**
 * "From UI to API", drawn: the three layers of a real app — the storefront,
 * the Express API and MongoDB — stacked in CSS 3D, with requests travelling
 * down through them and the responses climbing back up.
 *
 * Real CSS 3D, not WebGL, so the text stays crisp and the colours come
 * straight from the theme tokens. The engine below drives the DOM directly,
 * the same way DotField and CodeCursor do; React only renders the markup.
 */
const StackScene = ({ placement = "hero" }) => {
  const root = useRef(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const $ = (s) => node.querySelector(s);
    const $$ = (s) => node.querySelectorAll(s);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* every listener goes through this, so unmount removes them all at once */
    const events = new AbortController();
    const on = (el, type, fn, opts) => el.addEventListener(type, fn, { ...opts, signal: events.signal });

    const stage = $(".stage");
    const world = $(".world");
    const floor = $(".floor");
    const wire = $(".wire");
    const probe = $(".probe");
    const packet = $(".packet");
    const pkTag = $(".pk-tag");
    const hint = $(".hint");
    const slabs = [...$$(".slab")]
      .map((el) => ({ el, i: +el.dataset.i, face: el.querySelector(".face"), lift: 0, hover: 0, rev: 0, z: 0, rest: 0 }))
      .sort((a, b) => a.i - b.i);
    const tags = [...$$(".tag")].map((el) => ({ el, i: +el.dataset.i }));
    const [faceDB, faceAPI, faceUI] = slabs.map((s) => s.face);

    const signin = $(".ui-signin");
    const badgeEl = $(".ui-cart em");
    const add = $(".ui-card .add");
    const url = $(".url");
    const grid = $(".ui-grid");
    const toastEl = $(".toast");

    const cam = { ...BASE };
    const user = { yaw: 0, pitch: 0, vy: 0, vp: 0 };
    const par = { x: 0, y: 0, sx: 0, sy: 0 };
    const pk = { x: 0, y: 0, z: 0, on: false };
    let activeLayer = -1;
    let lastInteract = -1e9;
    let dragging = null;
    let scrollP = 0;
    let gapNow = GAP;
    let scale = 1;
    let introT = reduce ? 1e9 : -250;
    let wirePos = { x: 0, y: 0 };
    let badge = 2;
    let toastTimer;

    /* ---------- what the faces show ---------- */
    const setFlow = (flow, idx) => {
      $$(".tab").forEach((t) => t.classList.toggle("on", +t.dataset.i === idx));
      $(".code").innerHTML = flow.code
        .map((l, i) => `<div class="line"><span class="no">${i + 1}</span>${highlight(l)}</div>`)
        .join("");
      $(".status").innerHTML = `<span class="ok">&#9679; node · express</span><span class="req">${flow.method} ${flow.path}</span><span class="res">…</span>`;
    };

    const runLines = (a, b) => {
      faceAPI.querySelectorAll(".line").forEach((l, i) => l.classList.toggle("run", i >= a && i <= b));
    };

    const showDocs = (name, flow) => {
      $$(".db-colls li").forEach((li) => li.classList.toggle("on", li.dataset.c === name));
      const total = collections.find((c) => c.name === name).count;
      $(".db-docs").innerHTML =
        DOCS[name].map((d) => `<pre class="doc">${highlight(d)}</pre>`).join("") +
        `<span class="db-more">+ ${total - DOCS[name].length} more</span>`;
      if (!flow) return;
      $(".doc").classList.add("flash");
      $(".db-op").innerHTML = `<span class="kind${flow.write ? " w" : ""}">${flow.write ? "write" : "read"}</span><span>${flow.query}</span>`;
    };

    /* the layer doing the work glows, and everything above it lifts out of the way */
    const activate = (i) => {
      activeLayer = i;
      slabs.forEach((s) => s.el.classList.toggle("on", s.i === i));
      tags.forEach((t) => t.el.classList.toggle("on", t.i === i));
    };

    const ripple = (face, p) => {
      if (reduce) return;
      const r = document.createElement("i");
      r.className = "ripple";
      r.style.left = `${p.x}px`;
      r.style.top = `${p.y}px`;
      face.appendChild(r);
      const anim = r.animate(
        [
          { transform: "scale(1)", opacity: 1 },
          { transform: "scale(4.2)", opacity: 0 },
        ],
        { duration: 750, easing: "cubic-bezier(.16,1,.3,1)" }
      );
      anim.onfinish = () => r.remove();
    };

    /* restart a one-shot CSS animation */
    const replay = (el, cls) => {
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
    };

    const toast = (msg) => {
      toastEl.firstChild.textContent = msg;
      toastEl.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1900);
    };

    const setBadge = (n) => {
      badge = n;
      badgeEl.textContent = n;
      replay(badgeEl, "bump");
    };

    const log = (flow) => {
      const li = document.createElement("li");
      li.innerHTML = `<b>${flow.method}</b><span>${flow.path}</span><span class="c">${flow.status.split(" ")[0]}</span><span class="t">${flow.ms}ms</span>`;
      const list = $(".hud ol");
      list.prepend(li);
      while (list.children.length > 4) list.lastChild.remove();
    };

    /* what each request does to the storefront, as it leaves and as it lands */
    const UI_START = {
      products: () => {
        grid.classList.add("loading");
        url.textContent = "localhost:3000/shop";
        signin.textContent = "Sign in";
        signin.classList.remove("signed");
      },
      login: () => (url.textContent = "localhost:3000/login"),
      cart: () => (url.textContent = "localhost:3000/shop"),
      orders: () => (url.textContent = "localhost:3000/checkout"),
    };
    const UI_DONE = {
      products: () => {
        grid.classList.remove("loading");
        toast("12 products loaded");
      },
      login: () => {
        signin.textContent = `Hi, ${data.profile.name}`;
        signin.classList.add("signed");
        toast("Signed in · token saved");
      },
      cart: () => {
        setBadge(badge + 1);
        add.textContent = "✓ Added";
        add.classList.add("done");
        toast("Added to cart");
      },
      orders: () => {
        setBadge(0);
        add.textContent = "+ Add";
        add.classList.remove("done");
        toast("Paid ₹3,698 · Razorpay");
      },
    };

    /* centre of an element in its face's coordinates (layout space, not screen) */
    const posIn = (el, face) => {
      let x = el.offsetWidth / 2;
      let y = el.offsetHeight / 2;
      for (let n = el; n && n !== face; n = n.offsetParent) {
        x += n.offsetLeft;
        y += n.offsetTop;
      }
      return { x, y };
    };

    const setWire = (show, dir) => {
      wire.style.setProperty("--o", show ? 1 : 0);
      if (dir) wire.className = `wire ${dir}`;
    };

    /* ---------- timeline: steps advance on the render clock, so being
       off-screen or in a background tab freezes it cleanly ---------- */
    const BELOW = T + 16;
    const ABOVE = 16;
    /* endpoints read the live slab heights, so the packet tracks layers that are lifting */
    const atop = (i) => () => slabs[i].z + ABOVE;
    const under = (i) => () => slabs[i].z - BELOW;

    const travel = (p, z0, z1, label, dir, d, dest, onEnd) => ({
      d,
      start() {
        Object.assign(pk, { on: true, x: p.x, y: p.y, z: z0() });
        pkTag.innerHTML = label;
        packet.className = `packet ${dir}`;
        setWire(true, dir);
        activate(dest);
      },
      tick(t) {
        pk.z = z0() + (z1() - z0()) * easeInOut(t);
      },
      end() {
        pk.on = false;
        if (onEnd) onEnd();
      },
    });

    const buildFlow = (idx) => {
      const flow = FLOWS[idx];
      const trigger = faceUI.querySelector(TRIGGER[flow.key]);
      const p = posIn(trigger, faceUI);
      const [a, b] = flow.db;
      const steps = [];

      steps.push({
        d: 560,
        start() {
          setFlow(flow, idx);
          UI_START[flow.key]();
          wirePos = p;
          activate(2);
          replay(trigger, "press");
          ripple(faceUI, p);
          setWire(true, "down");
        },
      });
      steps.push(travel(p, under(2), atop(1), `<b>${flow.method}</b>${flow.path}`, "down", 820, 1, () => ripple(faceAPI, p)));
      for (let l = 0; l < a; l++) steps.push({ d: 260, start: () => runLines(l, l) });
      /* the await line: the request leaves for the database here */
      steps.push({ d: 320, start: () => runLines(a, b) });
      steps.push(
        travel(p, under(1), atop(0), flow.query, "down", 760, 0, () => {
          ripple(faceDB, p);
          showDocs(flow.coll, flow);
        })
      );
      steps.push({ d: 620 });
      steps.push(travel(p, atop(0), under(1), `&larr; ${flow.dbRes}`, "up", 700, 1, () => ripple(faceAPI, p)));
      for (let l = b + 1; l < flow.code.length; l++) steps.push({ d: 190, start: () => runLines(l, l) });
      steps.push(
        travel(p, atop(1), under(2), `<b>${flow.status}</b>· ${flow.ms}ms`, "up", 760, 2, () => {
          ripple(faceUI, p);
          UI_DONE[flow.key]();
          log(flow);
          $(".status .res").textContent = `${flow.status} · ${flow.ms}ms`;
        })
      );
      steps.push({
        d: 1500,
        end() {
          setWire(false);
          activate(-1);
          runLines(-1, -1);
        },
      });
      steps.push({ d: 450 });
      return steps;
    };

    let flowIdx = 0;
    let steps = null;
    let si = 0;
    let st = 0;
    const advance = (dt) => {
      if (!steps) {
        steps = buildFlow(flowIdx);
        si = 0;
        st = 0;
      }
      const current = steps[si];
      if (!current.started) {
        current.started = true;
        if (current.start) current.start();
      }
      st += dt;
      const t = Math.min(1, st / current.d);
      if (current.tick) current.tick(t);
      if (t >= 1) {
        if (current.end) current.end();
        si += 1;
        st = 0;
        if (si >= steps.length) {
          flowIdx = (flowIdx + 1) % FLOWS.length;
          steps = null;
        }
      }
    };

    /* reduced motion: one honest still frame, mid-request */
    const stillFrame = () => {
      const flow = FLOWS[2];
      setFlow(flow, 2);
      showDocs(flow.coll, flow);
      runLines(flow.db[0], flow.db[1]);
      activate(1);
      const p = posIn(faceUI.querySelector(TRIGGER[flow.key]), faceUI);
      wirePos = p;
      setWire(true, "down");
      Object.assign(pk, { on: true, x: p.x, y: p.y, z: GAP * 0.5 });
      pkTag.textContent = flow.query;
      packet.className = "packet down";
    };

    /* ---------- render ---------- */
    const fit = () => {
      scale = clamp(Math.min(stage.clientWidth / 680, stage.clientHeight / 620), 0.46, 1.04);
    };

    /* edge shading: light from the front-left, whichever way the stack is turned */
    const shadeOf = (nx, ny, yr) => {
      const sx = nx * Math.cos(yr) - ny * Math.sin(yr);
      const sy = nx * Math.sin(yr) + ny * Math.cos(yr);
      const d = sx * -0.55 + sy * 0.83;
      return (((1 - d) / 2) * 0.42 + 0.02).toFixed(3);
    };

    let last = performance.now();
    const step = (now) => {
      const dt = clamp(now - last, 0, 50);
      last = now;
      introT += dt;

      /* camera: drag + inertia, ease home when idle, parallax, sway, scroll */
      if (!dragging) {
        user.yaw += user.vy * dt;
        user.pitch += user.vp * dt;
        const decay = Math.pow(0.006, dt / 1000);
        user.vy *= decay;
        user.vp *= decay;
        /* unwind whole turns from both together so the way home is the short way */
        if (Math.abs(user.yaw) > 180) {
          const turns = Math.round(user.yaw / 360) * 360;
          user.yaw -= turns;
          cam.yaw -= turns;
        }
        if (now - lastInteract > 3200) {
          const k = 1 - Math.exp(-dt * 0.0022);
          user.yaw -= user.yaw * k;
          user.pitch -= user.pitch * k;
        }
      }
      user.pitch = clamp(user.pitch, 18 - BASE.pitch, 80 - BASE.pitch);
      const kp = 1 - Math.exp(-dt * 0.006);
      par.sx += (par.x - par.sx) * kp;
      par.sy += (par.y - par.sy) * kp;
      const sway = reduce ? 0 : Math.sin(now * 0.00033) * 5;
      const tYaw = BASE.yaw + user.yaw + par.sx * 7 + sway + scrollP * 24;
      const tPitch = clamp(BASE.pitch + user.pitch - par.sy * 4 - scrollP * 8, 15, 82);
      const kc = dragging ? 1 : 1 - Math.exp(-dt * 0.012);
      cam.yaw += (tYaw - cam.yaw) * kc;
      cam.pitch += (tPitch - cam.pitch) * kc;
      gapNow = GAP + scrollP * 80;

      if (!reduce && introT > INTRO_END) advance(dt);

      /* slabs: build-up intro, hover lift, and the reveal — whatever sits above
         the active (or hovered) layer rises so that layer can be seen working */
      const kl = 1 - Math.exp(-dt * 0.014);
      const kr = 1 - Math.exp(-dt * 0.0065);
      const hovered = slabs.find((s) => s.hover);
      const focus = hovered ? hovered.i : activeLayer;
      slabs.forEach((s) => {
        const p = clamp((introT - s.i * 190) / 950, 0, 1);
        const drop = (1 - easeOutBack(p)) * 260;
        s.lift += (s.hover - s.lift) * kl;
        s.rev += ((focus >= 0 && s.i > focus ? 1 : 0) - s.rev) * kr;
        s.rest = s.i * gapNow + s.rev * REVEAL;
        s.z = s.rest + drop + s.lift * 10;
        s.alpha = clamp(p * 1.7, 0, 1).toFixed(3);
        s.el.style.transform = `translateZ(${s.z.toFixed(2)}px)`;
        s.el.style.setProperty("--a", s.alpha);
      });
      floor.style.transform = `translateZ(${-T - 46}px)`;
      floor.style.setProperty("--a", clamp(introT / 600, 0, 1).toFixed(3));

      const yr = (cam.yaw * Math.PI) / 180;
      world.style.setProperty("--sn", shadeOf(0, -1, yr));
      world.style.setProperty("--ss", shadeOf(0, 1, yr));
      world.style.setProperty("--sw", shadeOf(-1, 0, yr));
      world.style.setProperty("--se", shadeOf(1, 0, yr));
      const zc = (slabs[2].rest - T) / 2 + 4;
      /* nudged right so the labels hanging off the left corner stay on screen */
      const nudge = 48 * scale + (stage.clientWidth < 520 ? 22 : 0);
      world.style.transform =
        `translate(${nudge.toFixed(1)}px, ${(34 * scale).toFixed(1)}px) scale3d(${scale},${scale},${scale}) ` +
        `rotateX(${cam.pitch.toFixed(3)}deg) rotateZ(${cam.yaw.toFixed(3)}deg) translateZ(${(-zc).toFixed(2)}px)`;

      /* billboards cancel the world rotation so they always face the viewer */
      const facing = `rotateZ(${(-cam.yaw).toFixed(3)}deg) rotateX(${(-cam.pitch).toFixed(3)}deg)`;
      const tagScale = clamp(0.85 / scale, 1, 1.35).toFixed(3); // labels stay readable when the stack is small
      tags.forEach((t) => {
        const s = slabs[t.i];
        t.el.style.transform = `translate3d(-6px, -6px, ${(s.z - T / 2).toFixed(2)}px) ${facing} scale(${tagScale})`;
        t.el.style.opacity = s.alpha;
      });

      /* project the packet: an invisible probe sits at its 3D position, and the
         packet is drawn in 2D where the probe lands, so no slab ever hides it */
      probe.style.transform = `translate3d(${pk.x}px, ${pk.y}px, ${pk.z.toFixed(2)}px)`;
      if (pk.on) {
        const pr = probe.getBoundingClientRect();
        const wr = node.getBoundingClientRect();
        const px = pr.left + pr.width / 2 - wr.left;
        packet.style.transform = `translate(${px.toFixed(1)}px, ${(pr.top + pr.height / 2 - wr.top).toFixed(1)}px)`;
        packet.classList.toggle("flip", px > wr.width - 200); // keep the label on screen
      }
      packet.style.opacity = pk.on ? 1 : 0;

      wire.style.height = `${slabs[2].z.toFixed(1)}px`;
      wire.style.transform = `translate3d(${wirePos.x - 1}px, ${wirePos.y}px, 0px) rotateX(90deg)`;
    };

    /* the loop only runs while the scene is on screen */
    let frame = 0;
    const loop = (now) => {
      step(now);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    /* ---------- input ---------- */
    on(stage, "pointerdown", (e) => {
      dragging = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId };
      user.vy = 0;
      user.vp = 0;
      stage.classList.add("dragging");
      hint.classList.add("gone");
      try {
        stage.setPointerCapture(e.pointerId);
      } catch (err) {
        /* the pointer is already gone */
      }
    });
    on(stage, "pointermove", (e) => {
      if (!dragging || e.pointerId !== dragging.id) return;
      const now = performance.now();
      const dx = e.clientX - dragging.x;
      const dy = e.clientY - dragging.y;
      const dtm = Math.max(1, now - dragging.t);
      user.yaw += dx * 0.42;
      user.pitch -= dy * 0.28;
      user.vy = user.vy * 0.5 + clamp((dx * 0.42) / dtm, -0.35, 0.35) * 0.5;
      user.vp = user.vp * 0.5 + clamp((-dy * 0.28) / dtm, -0.2, 0.2) * 0.5;
      Object.assign(dragging, { x: e.clientX, y: e.clientY, t: now });
      lastInteract = now;
    });
    const endDrag = () => {
      if (!dragging) return;
      /* a drag that stopped before letting go shouldn't fling */
      if (performance.now() - dragging.t > 80) {
        user.vy = 0;
        user.vp = 0;
      }
      dragging = null;
      lastInteract = performance.now();
      stage.classList.remove("dragging");
    };
    on(stage, "pointerup", endDrag);
    on(stage, "pointercancel", endDrag);
    on(stage, "dblclick", () => {
      user.vy = 0;
      user.vp = 0;
      lastInteract = -1e9;
    });

    slabs.forEach((s) => {
      on(s.face, "pointerenter", () => {
        if (!dragging) s.hover = 1;
      });
      on(s.face, "pointerleave", () => {
        s.hover = 0;
      });
    });

    /* subtle parallax from the mouse anywhere over the section it sits in */
    const section = node.closest("section");
    if (section && !window.matchMedia("(pointer: coarse)").matches) {
      on(section, "pointermove", (e) => {
        par.x = (e.clientX / window.innerWidth - 0.5) * 2;
        par.y = (e.clientY / window.innerHeight - 0.5) * 2;
      });
      on(section, "pointerleave", () => {
        par.x = 0;
        par.y = 0;
      });
    }

    /* the stack pulls apart as it scrolls up past the middle of the screen */
    const onScroll = () => {
      const r = stage.getBoundingClientRect();
      scrollP = clamp((window.innerHeight * 0.5 - (r.top + r.height / 2)) / (window.innerHeight * 0.6), 0, 1);
    };
    on(window, "scroll", onScroll, { passive: true });

    let ro;
    const onResize = () => {
      fit();
      onScroll();
    };
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(onResize);
      ro.observe(stage);
    } else {
      on(window, "resize", onResize);
    }

    /* ---------- boot ---------- */
    activate(-1);
    setWire(false);
    setFlow(FLOWS[0], 0);
    showDocs(FLOWS[0].coll);
    $(".hud ol").innerHTML = "";
    [FLOWS[3], FLOWS[2]].forEach((f) => log({ ...f, ms: f.ms + 7 }));
    onResize();
    if (reduce) stillFrame();

    let io;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
      io.observe(stage);
    } else {
      start();
    }

    return () => {
      stop();
      events.abort();
      clearTimeout(toastTimer);
      if (io) io.disconnect();
      if (ro) ro.disconnect();
    };
  }, []);

  return (
    <div className={`scene scene--${placement}`} ref={root}>
      <div className="hud" aria-hidden="true">
        <div className="hud__head">
          <span className="live">
            <i />
            Live
          </span>
          <span className="mono">request log</span>
        </div>
        <ol />
      </div>

      <div
        className="stage"
        role="img"
        aria-label="A request travelling from the storefront, through the API, to the database and back"
      >
        <div className="world">
          <div className="floor" />

          <Slab i={0}>
            <div className="face db">
              <div className="db-head">
                <svg viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
                  <path d="M6 0c.4 1.6 1.4 2.6 2.4 3.8C9.9 5.6 10.6 7.6 10 9.8 9.4 12 7.6 13 6.4 13.4L6 14l-.4-.6C4.4 13 2.6 12 2 9.8 1.4 7.6 2.1 5.6 3.6 3.8 4.6 2.6 5.6 1.6 6 0z" />
                </svg>
                mongodb <span className="db-name">/ shop</span>
                <span className="conn">&#9679; connected</span>
              </div>
              <div className="db-body">
                <ul className="db-colls">
                  {collections.map((c) => (
                    <li data-c={c.name} key={c.name}>
                      {c.name} <em>{c.count}</em>
                    </li>
                  ))}
                </ul>
                <div className="db-docs" />
              </div>
              <div className="db-op">
                <span className="kind">idle</span>
                <span>waiting for a query…</span>
              </div>
            </div>
          </Slab>

          <Slab i={1}>
            <div className="face api">
              <div className="tabs">
                {FLOWS.map((f, i) => (
                  <span className="tab" data-i={i} key={f.key}>
                    {f.file}
                  </span>
                ))}
              </div>
              <div className="code" />
              <div className="status" />
            </div>
          </Slab>

          <Slab i={2}>
            <div className="face ui">
              <div className="chrome">
                <span className="ui-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="url">localhost:3000/shop</span>
                <span className="refresh">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                    <path d="M10 6a4 4 0 1 1-1.2-2.85M10 1.5v2.2H7.8" />
                  </svg>
                </span>
              </div>
              <div className="ui-nav">
                <span className="logo">
                  store<span>.</span>
                </span>
                <span className="ui-signin">Sign in</span>
                <span className="ui-cart">
                  Cart <em>2</em>
                </span>
              </div>
              <div className="ui-grid">
                {products.map((p) => (
                  <div className="ui-card" key={p.name}>
                    <i className="img" />
                    <b>{p.name}</b>
                    <span className="price">{p.price}</span>
                    <span className="add">+ Add</span>
                  </div>
                ))}
              </div>
              <div className="ui-foot">
                <span className="mono">Showing {products.length} of 12</span>
                <span className="ui-checkout">Checkout &rarr;</span>
              </div>
              <div className="toast">
                <span />
              </div>
            </div>
          </Slab>

          <div className="wire" />

          <Tag i={2} index="01 / UI" label="React · Next.js" />
          <Tag i={1} index="02 / API" label="Node · Express" />
          <Tag i={0} index="03 / Data" label="MongoDB" />

          <div className="bb probe" />
        </div>
      </div>

      <div className="packet" aria-hidden="true">
        <i className="pk-trail" />
        <i className="pk-dot" />
        <span className="pk-tag" />
      </div>

      <p className="hint mono">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
          <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5M13.5 2.5V6H10" />
        </svg>
        Drag to turn it<span className="hint__more"> &middot; double-click to reset</span>
      </p>
    </div>
  );
};

export default StackScene;
