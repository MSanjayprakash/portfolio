import { jsx, jsxs } from "../jsx-runtime.js";
import { React } from "../runtime.js";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
const Fb = 26;
const Ib = 70;
const Lb = 0.38;
const Rb = 9e-4;
const ProfileCard = () => {
  let e = React.useRef(null), t = React.useRef(null), n = React.useRef(null);
  React.useEffect(() => {
    let r = e.current, i = t.current;
    if (!r || !i) return;
    let a = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches, o = window.matchMedia(`(pointer: coarse)`).matches, s = 0, c = 0, l = 0, u = 0, d = false, f = -1, p = 0, m = performance.now(), h = true, g = 0, _ = (e2, t2) => Math.max(-t2, Math.min(t2, e2)), v = () => {
      let e2 = r.getBoundingClientRect();
      return {
        x: e2.left + e2.width / 2,
        y: e2.top + 8
      };
    }, y = (e2) => {
      let t2 = performance.now(), n2 = Math.max((t2 - m) / 1e3, 8e-3), i2 = (e2.clientX - p) / n2;
      if (p = e2.clientX, m = t2, d && e2.pointerId === f) {
        let t3 = v();
        u = _(
          Math.atan2(-(e2.clientX - t3.x), Math.max(e2.clientY - t3.y, 60)),
          Lb
        );
        return;
      }
      if (a || o || !h) return;
      let s2 = r.getBoundingClientRect(), l2 = Math.abs(e2.clientX - (s2.left + s2.width / 2)) + Math.max(
        0,
        Math.abs(e2.clientY - (s2.top + s2.height / 2)) - s2.height / 2
      ), g2 = Math.max(0, 1 - l2 / 900);
      c += _(-i2 * Rb * g2, 0.25);
    }, b = (e2) => {
      d = true;
      f = e2.pointerId;
      i.setPointerCapture?.(e2.pointerId);
      i.style.cursor = `grabbing`;
      p = e2.clientX;
    }, x = (e2) => {
      e2.pointerId === f && (d = false, f = -1, u = 0, i.style.cursor = ``);
    }, S = new IntersectionObserver(
      ([e2]) => {
        h = e2.isIntersecting;
      },
      {
        rootMargin: `200px`
      }
    );
    S.observe(r);
    let C = performance.now(), w = (e2) => {
      g = requestAnimationFrame(w);
      let t2 = Math.min((e2 - C) / 1e3, 0.05);
      if (C = e2, !h && !d) return;
      let r2 = d ? Ib : Fb, a2 = d ? u : 0;
      c += -r2 * (s - a2) * t2;
      c *= Math.exp(-3.2 * t2);
      s += c * t2;
      Math.abs(s) > Lb && (s = Math.sign(s) * Lb, c *= -0.3);
      l += (c * 0.6 - l) * (1 - Math.exp(-6 * t2));
      let o2 = s * 180 / Math.PI;
      i.style.transform = `rotateZ(${o2}deg) rotateY(${_(l, 0.4) * 30}deg)`;
      n.current && (n.current.style.transform = `translateX(${-o2 * 2.2}px) rotateZ(${o2 * 0.8}deg)`);
    };
    g = requestAnimationFrame(w);
    window.addEventListener(`pointermove`, y, {
      passive: true
    });
    i.addEventListener(`pointerdown`, b);
    window.addEventListener(`pointerup`, x);
    window.addEventListener(`pointercancel`, x);
    return () => {
      cancelAnimationFrame(g);
      S.disconnect();
      window.removeEventListener(`pointermove`, y);
      i.removeEventListener(`pointerdown`, b);
      window.removeEventListener(`pointerup`, x);
      window.removeEventListener(`pointercancel`, x);
    };
  }, []);
  return /* @__PURE__ */ jsxs("div", { ref: e, className: "hang-rig", "data-no-ripple": true, children: [
    /* @__PURE__ */ jsx("span", { className: "hang-nail", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx("div", { ref: n, className: "hang-shadow", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs("div", { ref: t, className: "hang-swing", children: [
      /* @__PURE__ */ jsxs(
        "svg",
        {
          className: "hang-strings",
          viewBox: "0 0 100 100",
          preserveAspectRatio: "none",
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ jsx("line", { x1: "50", y1: "0", x2: "12", y2: "100" }),
            /* @__PURE__ */ jsx("line", { x1: "50", y1: "0", x2: "88", y2: "100" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "hang-frame glow-frame", children: [
        /* @__PURE__ */ jsx("span", { className: "hang-ring hang-ring-l", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("span", { className: "hang-ring hang-ring-r", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxs("div", { className: "relative aspect-[4/5] rounded-xl overflow-hidden bg-black/40 ring-1 ring-white/15", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/assets/hero-red-bg.png",
              alt: "Vaideeswaran Profile",
              draggable: false,
              className: "w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 select-none"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" }),
          /* @__PURE__ */ jsx("div", { className: "hang-glare", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxs("div", { className: "absolute bottom-3 left-3 right-3 text-center", children: [
            /* @__PURE__ */ jsx("span", { className: "text-white text-base md:text-xl font-black uppercase tracking-wider block", children: `Vaideeswaran` }),
            /* @__PURE__ */ jsx("span", { className: "text-red-400 text-xs md:text-sm uppercase font-bold tracking-widest", children: `UI/UX Designer` })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const About = () => {
  let sectionRef = React.useRef(null), t = React.useRef(null), n = React.useRef(null), a = React.useRef(null), o = React.useRef(null);
  useScrollReveal(
    sectionRef,
    `h2, .glass-panel-card, .tech-pill, [data-photo-reveal]`
  );
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "about",
      ref: sectionRef,
      className: "relative w-full min-h-screen text-gray-100 py-24 flex items-center justify-center overflow-hidden border-t border-white/5",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-5 md:px-12 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 flex flex-col gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[#a31515] font-bold uppercase text-sm md:text-base tracking-[0.2em]", children: `The Story Behind The Cuts` }),
            /* @__PURE__ */ jsx(
              "h2",
              {
                ref: t,
                className: "text-5xl sm:text-6xl md:text-8xl font-black tracking-tight uppercase text-white",
                children: `ABOUT VAIDEESHWARAN.`
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "w-24 h-1.5 bg-[#a31515] rounded-full mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: "red-halo", "aria-hidden": "true" }),
            /* @__PURE__ */ jsxs("div", { className: "glass glass-panel-card relative rounded-3xl p-5 md:p-12 flex flex-col gap-5 md:gap-8", children: [
              /* @__PURE__ */ jsx(
                "p",
                {
                  ref: n,
                  className: "text-gray-300 text-base md:text-2xl leading-relaxed font-medium",
                  children: `My path into UX started in graphic design, and that foundation still shapes how I work. I think carefully about colour, hierarchy, and layout — but what drives me is the layer underneath: why users hesitate, where flows break down, and what makes an interaction feel natural versus forced.

Over the past two years, I’ve worked across research-driven product design and real-world client projects — from user interviews to final delivery.

I'm Google-certified in UX Design, currently a Junior Web Designer at Medzlegal, and looking for a full-time UI/UX role where I can own the process from research through to handoff. I’ve worked on projects involving 500+ users, conducted 30+ direct interviews, and delivered real client work under actual deadlines.`
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xs md:text-base font-bold uppercase tracking-wider text-gray-500 mb-3 md:mb-4", children: `Core Toolkit & Proficiencies` }),
                /* @__PURE__ */ jsx("div", { ref: o, className: "flex flex-wrap gap-2 md:gap-3", children: [
                  `Figma`,
                  `Sketch`,
                  `Adobe XD`,
                  `InVision`,
                  `User Research`,
                  `Prototyping`,
                  `2D Lyrical Animation`,
                  `4K/60 Delivery`
                ].map((e) => /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "tech-pill glass-chip px-3.5 py-1.5 text-xs md:px-5 md:py-2.5 md:text-lg font-bold text-gray-200 rounded-full cursor-default",
                    children: e
                  },
                  e
                )) })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 flex justify-center relative", children: /* @__PURE__ */ jsx(
          "div",
          {
            ref: a,
            "data-photo-reveal": true,
            className: "flex flex-col items-center pointer-events-auto",
            children: /* @__PURE__ */ jsx(ProfileCard, {})
          }
        ) })
      ] })
    }
  );
};
export {
  About
};
