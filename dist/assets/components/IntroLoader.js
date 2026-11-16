import { jsx, jsxs } from "../jsx-runtime.js";
import { React, jsxRuntime } from "../runtime.js";
const introHeadline = `THE UI/UX DESIGNER YOU NEED`;
const introWords = introHeadline.split(` `);
const preloadImages = [
  `/media/Abi dp.jpg.jpeg`,
  `/assets/hero-red-bg.png`,
  `/assets/hero-icy-bg.png`,
  `/assets/web1-770H2sSx.png`
];
const hF = 7e3;
const gF = 500;
const _F = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
function preloadPortfolio(e) {
  let t = preloadImages.length + 3, n = 0, r = false, i = () => {
    r || (n += 1, e(Math.min(1, n / t)));
  };
  preloadImages.forEach((e2) => {
    let t2 = new Image();
    t2.onload = t2.onerror = i;
    t2.src = e2;
  });
  (document.fonts?.ready ?? Promise.resolve()).then(i, i);
  document.readyState === `complete` ? i() : window.addEventListener(`load`, i, {
    once: true
  });
  let a = 0, o = () => {
    r || (document.querySelector(`[data-scene-ready]`) || a > 60 ? i() : (a += 1, window.setTimeout(o, 100)));
  };
  o();
  return () => {
    r = true;
    window.removeEventListener(`load`, i);
  };
}
function IntroLoader({ onComplete }) {
  let [progress, setProgress] = React.useState(0), [phase, setPhase] = React.useState(`loading`), s = React.useRef(0), c = React.useRef(0), l = React.useRef(null), u = React.useRef(null), onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;
  React.useEffect(() => {
    document.body.style.overflow = `hidden`;
    let e = preloadPortfolio((e2) => s.current = e2), t = window.setTimeout(() => s.current = 1, hF), r = [], i = 0, a = performance.now(), f2 = (e2) => {
      let t2 = Math.min(64, e2 - a);
      a = e2;
      let p = s.current * 100, m = Math.min(
        p,
        c.current + Math.max(0.15, (p - c.current) * 6e-3 * t2)
      );
      c.current = m;
      setProgress(Math.floor(m));
      let h = c.current;
      if (l.current && (l.current.style.transform = `translateY(${-(h / 10)}em)`), u.current && (u.current.style.transform = `translateY(${-(9 - h % 10)}em)`), m >= 99.999) {
        setProgress(100);
        r.push(
          window.setTimeout(() => setPhase(`reveal`), gF),
          window.setTimeout(() => {
            document.body.style.overflow = ``;
            onCompleteRef.current();
          }, 1500)
        );
        return;
      }
      i = requestAnimationFrame(f2);
    };
    i = requestAnimationFrame(f2);
    return () => {
      e();
      cancelAnimationFrame(i);
      window.clearTimeout(t);
      r.forEach(window.clearTimeout);
      document.body.style.overflow = ``;
    };
  }, []);
  let f = progress / 100;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `glitch-loader ${phase === `reveal` ? `is-revealing` : ``}`,
      role: "progressbar",
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": progress,
      "aria-label": introHeadline,
      children: [
        /* @__PURE__ */ jsx("div", { className: "glitch-loader__veil" }),
        /* @__PURE__ */ jsx("div", { className: "glitch-loader__count", "aria-hidden": "true", children: progress >= 100 ? /* @__PURE__ */ jsx("span", { className: "glitch-loader__final", children: `100` }) : /* @__PURE__ */ jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: "glitch-loader__digit", children: /* @__PURE__ */ jsx("span", { ref: l, className: "glitch-loader__digit-strip", children: _F.map((e) => /* @__PURE__ */ jsx("span", { children: e }, e)) }) }),
          /* @__PURE__ */ jsx("span", { className: "glitch-loader__digit", children: /* @__PURE__ */ jsx("span", { ref: u, className: "glitch-loader__digit-strip", children: [..._F].reverse().map((e) => /* @__PURE__ */ jsx("span", { children: e }, e)) }) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "glitch-loader__center", children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "glitch-loader__statement",
              style: {
                filter: `blur(${(1 - f) * 6}px)`
              },
              "aria-hidden": "true",
              children: introWords.map((e, t) => {
                let n = t / introWords.length, r = Math.max(0, Math.min(1, (f - n * 0.7) * 3));
                return /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "glitch-loader__word",
                    style: {
                      opacity: r
                    },
                    children: e
                  },
                  t
                );
              })
            }
          ),
          [0, 1, 2, 3, 4].map((e) => /* @__PURE__ */ jsx(
            "p",
            {
              className: `glitch-loader__frag glitch-loader__frag--${e}`,
              "aria-hidden": "true",
              children: introHeadline
            },
            e
          ))
        ] })
      ]
    }
  );
}
export {
  IntroLoader
};
