import { jsx, jsxs } from "../jsx-runtime.js";
import {
  Fe,
  Dt,
  q,
  J,
  Dn,
  Pn,
  Pr,
  ei,
  _i,
  ki,
  qi,
  wa,
  co,
  wo,
  $o,
  ms,
  _s,
  vs,
  Is,
  Us,
  dc,
  ad,
  Dd,
  Od,
  ScrambledText,
  WebGLRenderer,
  Scene,
  PerspectiveCamera
} from "../vendor/portfolio-libraries.js";
import { React } from "../runtime.js";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
const heroBackgroundUrl = `/assets/hero-red-bg.png`;
const Vg = [0.22, 0];
const Hg = [0.515, 0];
const Ug = [0.84, 0];
const Wg = [0.34, 1];
const Gg = [0.865, 1];
const Kg = [0.385, 0.72];
const qg = [0.48, 0.62];
const Jg = [0.716, 0.49];
const heroPanels = [
  [[0, 0], Vg, qg, Kg, Wg, [0, 1]],
  [Vg, Hg, Jg, qg],
  [Hg, Ug, Jg],
  [Ug, [1, 0], [1, 1], Gg, Jg],
  [Kg, qg, Jg, Gg, Wg]
];
const panelJoints = [Kg, qg, Jg];
function getHeroBounds(e, t) {
  let n = e < 768, r = n ? Math.min(Math.max(e * 0.05, 16), 22) : e * 0.055, i = Math.max(t * 0.085, n ? 84 : 96), a = n ? t * 0.5 : t - i - t * 0.085;
  return {
    left: r,
    top: i,
    width: e - r * 2,
    height: a,
    mobile: n
  };
}
function Qg(e, t) {
  let n = e.length, r = e.reduce((t2, r2, i2) => {
    let a = e[(i2 + 1) % n];
    return t2 + (r2[0] * a[1] - a[0] * r2[1]);
  }, 0) > 0 ? 1 : -1, i = e.map((i2, a) => {
    let o = e[(a + 1) % n], s = -(o[1] - i2[1]), c = o[0] - i2[0], l = Math.hypot(s, c) || 1;
    s = s / l * r * t;
    c = c / l * r * t;
    return [
      [i2[0] + s, i2[1] + c],
      [o[0] + s, o[1] + c]
    ];
  });
  return i.map((e2, t2) => {
    let [r2, a] = i[(t2 - 1 + n) % n], [o, s] = e2, c = a[0] - r2[0], l = a[1] - r2[1], u = s[0] - o[0], d = s[1] - o[1], f = c * d - l * u;
    if (Math.abs(f) < 1e-9) return o;
    let p = ((o[0] - r2[0]) * d - (o[1] - r2[1]) * u) / f;
    return [r2[0] + c * p, r2[1] + l * p];
  });
}
function $g(e, t) {
  let n = new wa(), r = e.length;
  for (let i = 0; i < r; i++) {
    let a = e[i], o = e[(i - 1 + r) % r], s = e[(i + 1) % r], c = [o[0] - a[0], o[1] - a[1]], l = [s[0] - a[0], s[1] - a[1]], u = Math.hypot(...c), d = Math.hypot(...l), f = Math.min(t, u * 0.4, d * 0.4), p = [a[0] + c[0] / u * f, a[1] + c[1] / u * f], m = [a[0] + l[0] / d * f, a[1] + l[1] / d * f];
    i === 0 ? n.moveTo(p[0], p[1]) : n.lineTo(p[0], p[1]);
    n.quadraticCurveTo(a[0], a[1], m[0], m[1]);
  }
  n.closePath();
  return n;
}
function supportsWebGL() {
  try {
    let e = document.createElement(`canvas`);
    return !!(e.getContext(`webgl2`) || e.getContext(`webgl`));
  } catch {
    return false;
  }
}
const Hero = () => {
  let sectionRef = React.useRef(null), t = React.useRef(null), n = React.useRef(null), [hasWebGL, setHasWebGL] = React.useState(null), [s, c] = React.useState(false);
  useScrollReveal(
    sectionRef,
    `[data-hero-copy] > span, [data-hero-copy] > h1, [data-hero-copy] > div, [data-hero-copy] > p`
  );
  React.useEffect(() => {
    setHasWebGL(supportsWebGL());
  }, []);
  React.useEffect(() => {
    let e = window.matchMedia(`(max-width: 767px)`), t2 = () => c(e.matches);
    t2();
    e.addEventListener(`change`, t2);
    return () => e.removeEventListener(`change`, t2);
  }, []);
  React.useEffect(() => {
    if (!hasWebGL) return;
    let r = sectionRef.current, i = t.current;
    if (!r || !i) return;
    let o = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches, s2 = window.matchMedia(`(pointer: coarse)`).matches, c2 = getComputedStyle(document.documentElement), l = new Pn(c2.getPropertyValue(`--glass-reflection`).trim()), u = new Pn(c2.getPropertyValue(`--glass-highlight`).trim()), d = new WebGLRenderer({
      antialias: true,
      alpha: true
    });
    d.setPixelRatio(Math.min(window.devicePixelRatio || 1, s2 ? 1.5 : 2));
    d.setClearColor(0, 0);
    d.outputColorSpace = Fe;
    d.toneMapping = 4;
    d.toneMappingExposure = 0.95;
    i.appendChild(d.domElement);
    d.domElement.style.cssText = `position:absolute;inset:0;width:100%;height:100%;display:block`;
    let f = new Scene(), p = new dc(d), m = new ad(), h = p.fromScene(m, 0.04);
    m.dispose();
    f.environment = h.texture;
    f.environmentIntensity = 0.22;
    let g = new PerspectiveCamera(35, 1, 0.1, 100);
    g.position.set(0, 0, 10);
    let _ = new Dn();
    f.add(_);
    f.add(new vs(16777215, 0.08));
    let v = new _s(16771304, 0.7);
    v.position.set(-4, 5, 6);
    f.add(v);
    let y = new _s(u, 0.45);
    y.position.set(5, -3, 2);
    f.add(y);
    let b = new ms(l, 0, 6, 1.6);
    b.position.set(0, 0, 1.5);
    f.add(b);
    let x = new $o().load(heroBackgroundUrl, () => S = true);
    x.colorSpace = Fe;
    x.anisotropy = 8;
    let S = false, C = new wo({
      color: 1513243,
      roughness: 0.36,
      metalness: 0,
      specularIntensity: 0.35,
      specularColor: u,
      clearcoat: 0.7,
      clearcoatRoughness: 0.12,
      iridescence: 0.55,
      iridescenceIOR: 1.6,
      iridescenceThicknessRange: [100, 400],
      emissive: 16777215,
      emissiveMap: x,
      emissiveIntensity: 0.92,
      envMapIntensity: 0.28
    }), w = (e) => {
      e.uniforms.redReflection = {
        value: l
      };
      e.fragmentShader = `uniform vec3 redReflection;
` + e.fragmentShader;
      let t2 = Us.lights_fragment_begin.replace(
        `material.iridescenceFresnel = mix(`,
        `iridescenceFresnelDielectric = redReflection * dot(iridescenceFresnelDielectric, vec3(0.333333));
         iridescenceFresnelMetallic = redReflection * dot(iridescenceFresnelMetallic, vec3(0.333333));
         material.iridescenceFresnel = mix(`
      );
      e.fragmentShader = e.fragmentShader.replace(
        `#include <lights_fragment_begin>`,
        t2
      );
    }, T = new _i({
      color: u,
      transparent: true,
      opacity: 0.2
    }), E = [], D = 1, O = 1, k = false, A = () => {
      let e = E;
      E.forEach((e2) => {
        _.remove(e2.mesh);
        e2.mesh.geometry.dispose();
        e2.edge.geometry.dispose();
        e2.mat.dispose();
      });
      E = [];
      let t2 = o ? 0 : performance.now() / 1e3;
      heroPanels.forEach((n2, r2) => {
        let i2 = n2.map((e2) => {
          let [n3, r3] = e2, i3 = panelJoints.indexOf(e2);
          i3 >= 0 && (n3 += Math.sin(t2 * 0.5 + i3 * 2.1) * 6e-3, r3 += Math.cos(t2 * 0.4 + i3 * 1.3) * 6e-3);
          k && ([n3, r3] = [r3, n3]);
          return [(n3 - 0.5) * D, (0.5 - r3) * O];
        }), a = $g(Qg(i2, Math.min(D, O) * 0.012), Math.min(D, O) * 0.035), o2 = Math.min(D, O) * 0.045, s3 = new co(a, {
          depth: o2,
          bevelEnabled: true,
          bevelThickness: o2 * 0.35,
          bevelSize: o2 * 0.3,
          bevelSegments: 3,
          curveSegments: 8
        });
        s3.translate(0, 0, -o2);
        let c3 = s3.attributes.position, l2 = s3.attributes.uv, u2 = 16 / 9, d2 = D / O, f2 = 1, p2 = 1;
        d2 > u2 ? p2 = u2 / d2 : f2 = d2 / u2;
        let m2 = k ? 0.12 : 0.06;
        for (let e2 = 0; e2 < c3.count; e2++) {
          let t3 = (c3.getX(e2) / D + 0.5) * f2 + (1 - f2) / 2 + m2 * (1 - f2), n3 = (c3.getY(e2) / O + 0.5) * p2 + (1 - p2) / 2;
          l2.setXY(e2, Math.min(1, Math.max(0, t3)), n3);
        }
        l2.needsUpdate = true;
        let h2 = C.clone();
        h2.onBeforeCompile = w;
        h2.customProgramCacheKey = () => `muted-red-iridescence`;
        let g2 = new ei(s3, h2), v2 = new ki(new qi(s3, 25), T);
        g2.add(v2);
        let y2 = i2.reduce(
          (e2, t3) => [e2[0] + t3[0] / i2.length, e2[1] + t3[1] / i2.length],
          [0, 0]
        ), b2 = new q(y2[0], y2[1]), x2 = new J(y2[0] / D, y2[1] / O, 0.4 + r2 % 3 * 0.25).normalize(), S2 = new J(
          (Math.random() - 0.5) * 1.6,
          (Math.random() - 0.5) * 1.6,
          (Math.random() - 0.5) * 0.8
        );
        g2.userData.idx = r2;
        _.add(g2);
        E.push({
          mesh: g2,
          edge: v2,
          mat: h2,
          center: b2,
          dir: x2,
          spin: e[r2]?.spin ?? S2,
          lift: e[r2]?.lift ?? 0,
          phase: r2 * 1.37,
          x: e[r2]?.x ?? {
            position: 0,
            velocity: 0
          },
          y: e[r2]?.y ?? {
            position: 0,
            velocity: 0
          },
          targetX: e[r2]?.targetX ?? 0,
          targetY: e[r2]?.targetY ?? 0
        });
      });
    }, j = getHeroBounds(1, 1), M = () => {
      let e = r.clientWidth, t2 = r.clientHeight;
      d.setSize(e, t2, false);
      g.aspect = e / t2;
      j = getHeroBounds(e, t2);
      let i2 = 2 * g.position.z * Math.tan(Dt.degToRad(g.fov / 2)) / t2;
      if (D = j.width * i2, O = j.height * i2, _.position.set(0, -((j.top - (t2 - j.top - j.height)) / 2) * i2, 0), k = j.mobile, g.updateProjectionMatrix(), A(), n.current)
        if (j.mobile) {
          let e2 = j.top + j.height + Math.min(t2 * 0.02, 16);
          Object.assign(n.current.style, {
            left: `${j.left}px`,
            top: `${e2}px`,
            width: `${j.width}px`,
            height: `${Math.max(t2 - e2 - t2 * 0.03, 180)}px`
          });
        } else
          Object.assign(n.current.style, {
            left: `${j.left}px`,
            top: `${j.top}px`,
            width: `${j.width}px`,
            height: `${j.height}px`
          });
    };
    M();
    let N = new ResizeObserver(M);
    N.observe(r);
    let P = new q(0, 0), F = new Is(), I = new Pr(), ee = new J(), te = new J(), ne = -1, re = null, L = 0, R = new q(), z = false, B = (e) => {
      let t2 = r.getBoundingClientRect();
      if (P.x = (e.clientX - t2.left) / t2.width * 2 - 1, P.y = -((e.clientY - t2.top) / t2.height) * 2 + 1, z = true, ne >= 0 && e.pointerId === re && (F.setFromCamera(P, g), F.ray.intersectPlane(I, te))) {
        let e2 = _.worldToLocal(te.clone()), t3 = E[ne];
        t3.targetX = Od(R.x + e2.x - ee.x, D);
        t3.targetY = Od(R.y + e2.y - ee.y, O);
      }
    }, V = () => {
      z = false;
    }, ie = () => {
      if (ne < 0) return;
      let e = E[ne];
      e.targetX = 0;
      e.targetY = 0;
      ne = -1;
      r.classList.remove(`shard-dragging`);
      i.style.cursor = ``;
      re !== null && r.hasPointerCapture(re) && r.releasePointerCapture(re);
      re = null;
    }, H = (e) => {
      if (ne >= 0 || e.pointerType === `mouse` && e.button !== 0 || e.target.closest(`a, button, input, textarea, nav`) || r.getBoundingClientRect().top < -r.clientHeight * 0.04)
        return;
      B(e);
      f.updateMatrixWorld(true);
      F.setFromCamera(P, g);
      let t2 = F.intersectObjects(
        E.map((e2) => e2.mesh),
        false
      )[0];
      if (!t2) return;
      ne = t2.object.userData.idx;
      re = e.pointerId;
      let n2 = E[ne];
      L = n2.mesh.position.z;
      I.setFromNormalAndCoplanarPoint(new J(0, 0, 1), t2.point);
      ee.copy(_.worldToLocal(t2.point.clone()));
      R.set(n2.x.position, n2.y.position);
      r.setPointerCapture(e.pointerId);
      r.classList.add(`shard-dragging`);
      i.style.cursor = `grabbing`;
      e.preventDefault();
    };
    r.addEventListener(`pointermove`, B);
    r.addEventListener(`pointerleave`, V);
    r.addEventListener(`pointerdown`, H);
    r.addEventListener(`pointerup`, ie);
    r.addEventListener(`pointercancel`, ie);
    r.addEventListener(`lostpointercapture`, ie);
    window.addEventListener(`blur`, ie);
    let U = {
      x: 0,
      y: 0
    }, ae = -1, W = 0, oe = 0, se = performance.now(), ce = 0, le = true, ue = new IntersectionObserver(([e]) => {
      le = e.isIntersecting;
      le || ie();
    });
    ue.observe(r);
    let de = (e) => {
      if (oe = requestAnimationFrame(de), !le) {
        se = e;
        return;
      }
      let t2 = Math.min((e - se) / 1e3, 0.05);
      se = e;
      let a = e / 1e3, c3 = (e2) => 1 - Math.exp(-e2 * t2), l2 = ne >= 0 ? U.x : z && !o ? -P.y * Dt.degToRad(5.5) : 0, u2 = ne >= 0 ? U.y : z && !o ? P.x * Dt.degToRad(7) : 0;
      U.x += (l2 - U.x) * c3(5);
      U.y += (u2 - U.y) * c3(5);
      let p2 = r.getBoundingClientRect(), m2 = Dt.clamp(-p2.top / (p2.height * 0.8), 0, 1);
      W += (m2 - W) * c3(8);
      let h2 = W * W * (3 - 2 * W);
      if (_.rotation.set(U.x, U.y, 0), _.updateMatrixWorld(true), ae = -1, z && !s2 && h2 < 0.05) {
        F.setFromCamera(P, g);
        let e2 = F.intersectObjects(
          E.map((e3) => e3.mesh),
          false
        )[0];
        e2 && (ae = e2.object.userData.idx, _.worldToLocal(e2.point.clone()), b.position.set(e2.point.x, e2.point.y, e2.point.z + 1.2));
      }
      b.intensity += ((ae >= 0 || ne >= 0 ? 1.4 : 0) - b.intensity) * c3(6);
      ce += t2;
      let v2 = E.some((e2) => e2.x.position !== 0 || e2.y.position !== 0);
      !o && ne < 0 && !v2 && ce > 0.25 && h2 < 0.02 && (ce = 0, A());
      E.forEach((e2, n2) => {
        let r2 = ne === n2 || e2.x.position !== 0 || e2.y.position !== 0;
        e2.lift += (+(!r2 && ae === n2) - e2.lift) * c3(7);
        Dd(e2.x, e2.targetX, t2);
        Dd(e2.y, e2.targetY, t2);
        let i2 = o || r2 ? 0 : Math.sin(a * 0.8 + e2.phase) * 0.03, s3 = e2.mesh, l3 = h2 * Math.max(D, O) * 0.9;
        s3.position.set(
          e2.dir.x * l3 + e2.x.position,
          e2.dir.y * l3 + e2.y.position,
          (ne === n2 ? L : i2 + e2.lift * 0.35) + e2.dir.z * l3 * 0.6
        );
        s3.rotation.set(
          e2.spin.x * h2 + e2.lift * -0.05 * P.y + e2.y.position * -0.06,
          e2.spin.y * h2 + e2.lift * 0.06 * P.x + e2.x.position * 0.06,
          e2.spin.z * h2 + e2.x.position * 0.025
        );
        e2.mat.iridescence = 0.55;
        e2.mat.emissiveIntensity = (S ? 0.92 : 0) * (1 - h2 * 0.5) + e2.lift * 0.08;
      });
      n.current && (n.current.style.transform = `perspective(1400px) rotateX(${-U.x * 180 / Math.PI}deg) rotateY(${U.y * 180 / Math.PI}deg) translate3d(${-h2 * 140}px, ${-h2 * 60}px, ${h2 * 80}px)`, n.current.style.opacity = String(1 - h2 * 1.2));
      d.render(f, g);
      S && (i.dataset.sceneReady = `1`);
    };
    oe = requestAnimationFrame(de);
    return () => {
      cancelAnimationFrame(oe);
      N.disconnect();
      ue.disconnect();
      r.removeEventListener(`pointermove`, B);
      r.removeEventListener(`pointerleave`, V);
      ie();
      r.removeEventListener(`pointerdown`, H);
      r.removeEventListener(`pointerup`, ie);
      r.removeEventListener(`pointercancel`, ie);
      r.removeEventListener(`lostpointercapture`, ie);
      window.removeEventListener(`blur`, ie);
      E.forEach((e) => {
        e.mesh.geometry.dispose();
        e.edge.geometry.dispose();
        e.mat.dispose();
      });
      C.dispose();
      T.dispose();
      x.dispose();
      h.dispose();
      p.dispose();
      d.dispose();
      d.domElement.remove();
    };
  }, [hasWebGL]);
  return /* @__PURE__ */ jsx("div", { id: "hero", className: "w-full flex flex-col overflow-hidden", children: /* @__PURE__ */ jsxs(
    "section",
    {
      ref: sectionRef,
      className: "relative w-full h-[100svh] min-h-[640px] overflow-hidden",
      style: {
        touchAction: `pan-y`
      },
      children: [
        hasWebGL === false && /* @__PURE__ */ jsxs(
          "div",
          {
            className: "absolute rounded-[28px] overflow-hidden border border-white/10 shadow-glass",
            style: s ? {
              left: `clamp(16px, 5%, 22px)`,
              right: `clamp(16px, 5%, 22px)`,
              top: `max(8.5%, 84px)`,
              height: `50%`
            } : {
              left: `5.5%`,
              right: `5.5%`,
              top: `max(8.5%, 96px)`,
              bottom: `8.5%`
            },
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: heroBackgroundUrl,
                  alt: "Vaideeshwaran - UI/UX Designer",
                  className: "absolute inset-0 w-full h-full object-cover",
                  style: {
                    objectPosition: `68% center`
                  }
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#050507]/80 via-[#050507]/30 to-transparent" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: t,
            className: "absolute inset-0 touch-pan-y",
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: n,
            className: `absolute flex items-center max-md:items-end will-change-transform pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto`,
            style: hasWebGL === false ? s ? {
              left: `4%`,
              right: `4%`,
              top: `calc(max(8.5%, 84px) + 50% + 12px)`,
              bottom: `3%`
            } : {
              left: `5.5%`,
              right: `5.5%`,
              top: `max(8.5%, 96px)`,
              bottom: `8.5%`
            } : {
              transformOrigin: `50% 50%`
            },
            children: /* @__PURE__ */ jsx("div", { className: "pl-[6%] pr-6 max-w-[min(44rem,92%)] max-md:max-w-full max-md:pl-3 max-md:pr-3 max-md:pb-1 max-md:w-full max-md:rounded-3xl max-md:bg-gradient-to-t max-md:from-[#050507]/90 max-md:via-[#050507]/55 max-md:to-transparent max-md:pt-4", children: /* @__PURE__ */ jsxs(
              "div",
              {
                "data-hero-copy": true,
                className: "flex flex-col gap-2 sm:gap-3.5",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[#ff2a3b] font-bold uppercase text-[11px] sm:text-xs md:text-sm tracking-[0.25em]", children: `VISUAL STORYTELLER \u2022 DIGITAL CREATIVE` }),
                  /* @__PURE__ */ jsx("h1", { className: "text-white text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[0.88] uppercase drop-shadow-md", children: `VAIDEESHWARAN` }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3 text-white font-extrabold text-sm sm:text-base md:text-lg lg:text-xl uppercase tracking-wider mt-0.5", children: [
                    /* @__PURE__ */ jsx("span", { children: `UI/UX DESIGNER` }),
                    /* @__PURE__ */ jsx("span", { className: "text-[#ff2a3b] font-bold", children: `/` }),
                    /* @__PURE__ */ jsx("span", { children: `GRAPHIC DESIGNER` })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg font-normal tracking-wide mt-1", children: `Crafting visuals that make brands stand out.` }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 sm:gap-4 mt-3 sm:mt-6", children: [
                    /* @__PURE__ */ jsx(
                      ScrambledText,
                      {
                        href: "#projects",
                        variant: "primary",
                        children: `EXPLORE MY WORK`
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: "#contact",
                        className: "glass glass-hover inline-flex items-center justify-center px-5 py-3 sm:px-7 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-200 hover:text-white hover:-translate-y-0.5 transition-all duration-300",
                        children: `Get In Touch`
                      }
                    )
                  ] })
                ]
              }
            ) })
          }
        )
      ]
    }
  ) });
};
export {
  Hero
};
