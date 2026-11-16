import { jsx, jsxs } from "../jsx-runtime.js";
import {
  f,
  Dt,
  q,
  Ot,
  J,
  Qt,
  Sr,
  ei,
  ri,
  gi,
  Li,
  ra,
  fo,
  xo,
  $o,
  Is,
  kd,
  WebGLRenderer,
  Scene,
  PerspectiveCamera
} from "../vendor/portfolio-libraries.js";
import { React } from "../runtime.js";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { masterDriveFolder, projects } from "../data/portfolio.js";
import { Button } from "./Button.js";
const cx = {
  FOV: 42,
  CAM_Z: 9,
  CARD_W: 3.4,
  SPACING: 0.13,
  RAIL_SPAN: 1.7,
  FLY_SPAN: 0.35,
  HOLD: 0.12,
  RAIL: [
    [0, 3, -60],
    [-10, 2, -34],
    [-12, 0.5, -14],
    [-7, -0.4, -1],
    [0, -0.8, 3.2],
    [7, -0.4, -1],
    [12, 0.6, -12],
    [9, 1.6, -26],
    [2, 2.2, -34]
  ],
  RAIL_MOBILE: [
    [0, 3, -50],
    [-4, 1.5, -26],
    [-3.5, 0, -8],
    [0, -0.6, 2.5],
    [3.5, 0, -8],
    [4, 1.5, -24],
    [1, 2.4, -32]
  ]
};
const lx = (e) => Math.max(0, Math.min(1, e));
const ux = (e) => e < 0.5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2;
function dx(e) {
  return cx.RAIL_SPAN + cx.FLY_SPAN + (e - 1) * cx.SPACING + cx.HOLD;
}
function fx(e, t, n) {
  let r = lx(e) * dx(n) - t * cx.SPACING;
  return {
    rail: lx(r / cx.RAIL_SPAN),
    fly: lx((r - cx.RAIL_SPAN) / cx.FLY_SPAN),
    opacity: r <= 0 ? 0 : Math.min(1, r / 0.12)
  };
}
function px(e, t, n, r, i) {
  let a = 2 * i * Math.tan(r / 2 * Math.PI / 180), o = t / n, s = a * o, c = o < 0.8 ? 2 : 3, l = Math.ceil(e / c), u = a * (o < 0.8 ? 0.34 : 0.4), d = a - u - a * 0.04, f2 = Math.min(s, a) * 0.025, p = 16 / 9, m = Math.min((s * 0.92 - f2 * (c - 1)) / c, (d - f2 * (l - 1)) / l * p);
  m = Math.max(m, 0.5);
  let h = m / p, g = c * m + (c - 1) * f2, _ = l * h + (l - 1) * f2, v = a / 2 - u - (d - _) / 2;
  return {
    cells: Array.from(
      {
        length: e
      },
      (e2, t2) => {
        let n2 = t2 % c, r2 = Math.floor(t2 / c);
        return {
          x: -g / 2 + m / 2 + n2 * (m + f2),
          y: v - h / 2 - r2 * (h + f2),
          side: c > 1 && n2 === 0 ? -1 : +(c > 1 && n2 === c - 1),
          vert: r2 === 0 ? 1 : r2 === l - 1 ? -1 : 0
        };
      }
    ),
    cellW: m,
    cellH: h,
    cols: c,
    rows: l
  };
}
function ProjectCard({ project: e }) {
  let t = React.useRef(null), n = React.useRef(null), [a, o] = React.useState(false);
  React.useEffect(() => {
    let r = t.current, i = n.current;
    if (!r || !i || !e.videoUrl) return;
    let a2 = false, s = false, c = () => {
      !a2 || s || document.hidden || (i.preload = `auto`, i.muted = true, i.play().catch(() => {
      }));
    }, l = new IntersectionObserver(
      ([e2]) => {
        a2 = e2?.isIntersecting ?? false;
        a2 ? c() : i.pause();
      },
      {
        rootMargin: `250px`
      }
    );
    l.observe(r);
    let u = () => {
      document.hidden ? i.pause() : c();
    }, d = () => {
      s = true;
      o(false);
    };
    i.addEventListener(`error`, d);
    document.addEventListener(`visibilitychange`, u);
    document.addEventListener(`pointerdown`, c);
    return () => {
      l.disconnect();
      i.pause();
      i.removeEventListener(`error`, d);
      document.removeEventListener(`visibilitychange`, u);
      document.removeEventListener(`pointerdown`, c);
    };
  }, [e.videoUrl]);
  return /* @__PURE__ */ jsxs("div", { ref: t, className: "project-video-fallback", "data-video-ready": a, children: [
    /* @__PURE__ */ jsx("img", { src: e.poster, alt: "", loading: "lazy" }),
    /* @__PURE__ */ jsx(
      "video",
      {
        ref: n,
        src: e.videoUrl ? encodeURI(e.videoUrl) : void 0,
        poster: e.poster,
        muted: true,
        loop: true,
        playsInline: true,
        preload: "metadata",
        onPlaying: () => o(true),
        "aria-label": e.title
      }
    )
  ] });
}
const previewAspectRatio = 16 / 9;
const cardVertexShader = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const cardFragmentShader = `
  uniform sampler2D map;
  uniform vec2 uvScale;
  uniform vec2 uvOffset;
  uniform float uOpacity;
  uniform float uHover;
  uniform float uReady;
  varying vec2 vUv;
  float rbox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
  void main() {
    vec2 uv = vUv;
    if (!gl_FrontFacing) uv.x = 1.0 - uv.x; // never mirror footage from behind
    vec2 p = (uv - 0.5) * vec2(${previewAspectRatio.toFixed(4)}, 1.0);
    float d = rbox(p, vec2(${(previewAspectRatio / 2).toFixed(4)}, 0.5), 0.07);
    float mask = 1.0 - smoothstep(-0.003, 0.003, d);
    if (mask < 0.01) discard;
    vec3 tex = texture2D(map, uv * uvScale + uvOffset).rgb;
    vec3 col = mix(vec3(0.05, 0.035, 0.045), tex, uReady);
    col *= 0.82 + 0.28 * uHover;
    // soft glass reflections
    col += vec3(1.0) * 0.07 * smoothstep(0.55, 1.0, uv.y) * (1.0 - uv.x * 0.6);
    col += vec3(1.0, 0.12, 0.2) * 0.18 * uHover * smoothstep(0.45, 0.0, uv.y);
    // liquid glass rim
    float rim = smoothstep(-0.022, -0.004, d);
    vec3 rimCol = mix(vec3(0.75, 0.75, 0.8), vec3(1.0, 0.3, 0.38), uHover);
    col = mix(col, rimCol, rim * (0.35 + 0.35 * uHover));
    gl_FragColor = vec4(col, mask * uOpacity);
  }
`;
function getPosterVariants(e) {
  if (!e.poster) return [];
  let t = e.poster.match(/^(.*)-1\.(jpg|jpeg|png|webp)$/i);
  return t ? [1, 2, 3].map((e2) => `${t[1]}-${e2}.${t[2]}`) : [e.poster];
}
const FeaturedWork = ({ onSelectProject }) => {
  let sectionRef = React.useRef(null), canvasContainerRef = React.useRef(null), tooltipRef = React.useRef(null), selectProjectRef = React.useRef(onSelectProject);
  selectProjectRef.current = onSelectProject;
  let [showFallback, setShowFallback] = React.useState(false);
  useScrollReveal(
    sectionRef,
    `[data-project-heading] > *, [data-project-fallback]`
  );
  React.useEffect(() => {
    if (window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) {
      setShowFallback(true);
      return;
    }
    let e = sectionRef.current, r = canvasContainerRef.current, i = tooltipRef.current;
    if (!e || !r) return;
    let s;
    try {
      s = new WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: `high-performance`
      });
    } catch {
      setShowFallback(true);
      return;
    }
    let l2 = window.matchMedia(`(max-width: 768px), (pointer: coarse)`).matches;
    s.setPixelRatio(Math.min(window.devicePixelRatio || 1, l2 ? 1.5 : 2));
    s.setClearColor(0, 0);
    r.appendChild(s.domElement);
    s.domElement.style.cssText = `position:absolute;inset:0;width:100%;height:100%;display:block`;
    let u = new Scene(), d = new PerspectiveCamera(cx.FOV, 1, 0.1, 200);
    d.position.set(0, 0, cx.CAM_Z);
    let p = new ra(
      (l2 ? cx.RAIL_MOBILE : cx.RAIL).map(([e2, t, n]) => new J(e2, t, n)),
      false,
      `centripetal`
    ), m = [], h = [];
    for (let e2 = 0; e2 <= 400; e2++)
      m.push(p.getPointAt(e2 / 400)), h.push(p.getTangentAt(e2 / 400));
    let g = (e2, t, n) => {
      let r2 = Math.max(0, Math.min(1, e2)) * 400, i2 = Math.min(Math.floor(r2), 399), a = r2 - i2;
      t.lerpVectors(m[i2], m[i2 + 1], a);
      n.lerpVectors(h[i2], h[i2 + 1], a).normalize();
    }, _ = new fo(previewAspectRatio, 1, 24, 14), v = new $o(), y = new ri(new Uint8Array([10, 8, 10, 255]), 1, 1);
    y.needsUpdate = true;
    let b = (e2, t, n) => {
      let r2 = t / n;
      if (r2 > previewAspectRatio) {
        let t2 = previewAspectRatio / r2;
        e2.uniforms.uvScale.value.set(t2, 1);
        e2.uniforms.uvOffset.value.set((1 - t2) / 2, 0);
      } else {
        let t2 = r2 / previewAspectRatio;
        e2.uniforms.uvScale.value.set(1, t2);
        e2.uniforms.uvOffset.value.set(0, (1 - t2) / 2);
      }
    }, x = projects.map((e2, t) => {
      let n = new xo({
        vertexShader: cardVertexShader,
        fragmentShader: cardFragmentShader,
        transparent: true,
        side: 2,
        depthWrite: false,
        uniforms: {
          map: {
            value: y
          },
          uvScale: {
            value: new q(1, 1)
          },
          uvOffset: {
            value: new q()
          },
          uOpacity: {
            value: 0
          },
          uHover: {
            value: 0
          },
          uReady: {
            value: 0
          }
        }
      }), r2 = new ei(_, n);
      r2.userData.index = t;
      u.add(r2);
      let i2 = {
        project: e2,
        mesh: r2,
        mat: n,
        thumbs: [],
        thumbIdx: 0,
        video: null,
        videoTex: null,
        playing: false,
        hover: 0,
        failed: false,
        pending: false,
        retryAt: 0,
        farTime: 0,
        wanted: false,
        cleanupVideo: () => {
        }
      };
      if (getPosterVariants(e2).forEach((e3, t2) => {
        v.load(e3, (e4) => {
          e4.minFilter = f;
          e4.generateMipmaps = false;
          i2.thumbs[t2] = e4;
          !i2.videoTex && t2 === 0 && (n.uniforms.map.value = e4, b(n, e4.image.width, e4.image.height), n.uniforms.uReady.value = 1);
        });
      }), e2.videoUrl) {
        let t2 = document.createElement(`video`);
        t2.muted = true;
        t2.loop = true;
        t2.playsInline = true;
        t2.autoplay = false;
        t2.preload = `metadata`;
        t2.setAttribute(`playsinline`, ``);
        t2.setAttribute(`muted`, ``);
        t2.src = encodeURI(e2.videoUrl);
        let r3 = () => {
          if (i2.failed || i2.videoTex) return;
          let e3 = new Li(t2);
          e3.minFilter = f;
          e3.generateMipmaps = false;
          i2.videoTex = e3;
          b(n, t2.videoWidth || 16, t2.videoHeight || 9);
        }, a = () => {
          i2.videoTex || r3();
          i2.videoTex && (n.uniforms.map.value = i2.videoTex, n.uniforms.uReady.value = 1);
          i2.playing = true;
        }, o = () => {
          i2.failed = true;
          i2.playing = false;
          i2.pending = false;
          i2.thumbs[0] && (n.uniforms.map.value = i2.thumbs[0], b(n, i2.thumbs[0].image.width, i2.thumbs[0].image.height));
        };
        t2.addEventListener(`loadeddata`, r3);
        t2.addEventListener(`playing`, a);
        t2.addEventListener(`error`, o);
        i2.cleanupVideo = () => {
          t2.removeEventListener(`loadeddata`, r3);
          t2.removeEventListener(`playing`, a);
          t2.removeEventListener(`error`, o);
        };
        i2.video = t2;
      }
      return i2;
    }), S = 1, C = 1, w = null, T = () => {
      S = r.clientWidth;
      C = r.clientHeight;
      s.setSize(S, C, false);
      d.aspect = S / C;
      d.updateProjectionMatrix();
      w = px(x.length, S, C, cx.FOV, cx.CAM_Z);
    };
    T();
    window.addEventListener(`resize`, T);
    let E = 0, D = 0, O = false, k = () => {
      let t = e.getBoundingClientRect(), n = t.height - window.innerHeight;
      E = n > 0 ? Math.max(0, Math.min(1, -t.top / n)) : 0;
    };
    k();
    window.addEventListener(`scroll`, k, {
      passive: true
    });
    let A = () => x.forEach((e2) => {
      e2.wanted = false;
      e2.video?.pause();
      e2.playing = false;
    }), j = new IntersectionObserver(
      ([e2]) => {
        O = e2.isIntersecting;
        O || A();
      },
      {
        rootMargin: `250px`
      }
    );
    j.observe(r);
    let M = (e2, t) => {
      !e2.video || e2.failed || e2.pending || e2.playing || !e2.wanted || t < e2.retryAt || document.hidden || (e2.pending = true, e2.video.muted = true, e2.video.preload = `auto`, e2.video.play().then(() => {
        e2.pending = false;
        !e2.wanted || document.hidden ? (e2.video.pause(), e2.playing = false) : e2.playing = true;
      }).catch(() => {
        e2.pending = false;
        e2.playing = false;
        e2.retryAt = performance.now() + 3e3;
      }));
    }, N = () => x.forEach((e2) => {
      e2.retryAt = 0;
      M(e2, performance.now());
    }), P = () => {
      document.hidden ? A() : ye = 0;
    };
    document.addEventListener(`pointerdown`, N);
    document.addEventListener(`visibilitychange`, P);
    let F = new Is(), I = new q(9, 9), ee = -1, te = 0, ne = 0, re = 0, L = 0, R = (e2) => {
      let t = r.getBoundingClientRect();
      te = e2.clientX - t.left;
      ne = e2.clientY - t.top;
      I.set(te / t.width * 2 - 1, -(ne / t.height) * 2 + 1);
    }, z = () => I.set(9, 9), B = (e2) => {
      re = e2.clientX;
      L = e2.clientY;
      R(e2);
    }, V = (e2) => {
      Math.hypot(e2.clientX - re, e2.clientY - L) > 8 || (R(e2), ie(), ee >= 0 && selectProjectRef.current(x[ee].project));
    }, ie = () => {
      F.setFromCamera(I, d);
      let e2 = F.intersectObjects(
        x.filter((e3) => e3.mat.uniforms.uOpacity.value > 0.3).map((e3) => e3.mesh)
      );
      ee = e2.length ? e2[0].object.userData.index : -1;
    };
    r.addEventListener(`pointermove`, R);
    r.addEventListener(`pointerleave`, z);
    r.addEventListener(`pointerdown`, B);
    r.addEventListener(`pointerup`, V);
    let H = new J(), U = new J(), ae = new J(), W = new J(), oe = new J(0, 1, 0), se = new Qt(), ce = new Ot(), le = new Ot(), ue = new Ot(), de = new J(), fe = new J(), pe = new J(), me = new J(), he = new gi(), ge = new Qt(), _e = performance.now(), ve = 0, ye = 0, be = 0, xe = (e2) => {
      ve = requestAnimationFrame(xe);
      let t = Math.min((e2 - _e) / 1e3, 0.05);
      if (_e = e2, !(!O || document.hidden)) {
        if (D += (E - D) * (1 - Math.exp(-7 * t)), Math.abs(E - D) < 1e-5 && (D = E), be += t, x.forEach((e3, n) => {
          let r2 = fx(D, n, x.length);
          g(r2.rail, H, U);
          ae.set(U.x, 0, U.z);
          ae.lengthSq() < 1e-4 && ae.set(1, 0, 0);
          ae.normalize();
          W.crossVectors(ae, oe).normalize();
          W.z < 0 && W.negate();
          se.makeBasis(me.crossVectors(oe, W).normalize(), oe, W);
          ce.setFromRotationMatrix(se);
          let i2 = cx.CARD_W / previewAspectRatio, a = w.cells[n];
          if (r2.fly <= 0)
            e3.mesh.position.copy(H), e3.mesh.quaternion.copy(ce), e3.mesh.scale.setScalar(i2);
          else {
            g(1, pe, U);
            de.set(a.x, a.y, 0);
            fe.set(
              a.x + a.side * w.cellW * 0.9,
              a.y + a.vert * w.cellH * 1.6,
              1.2
            );
            let t2 = ux(r2.fly), n2 = 1 - t2;
            e3.mesh.position.set(
              n2 * n2 * pe.x + 2 * n2 * t2 * fe.x + t2 * t2 * de.x,
              n2 * n2 * pe.y + 2 * n2 * t2 * fe.y + t2 * t2 * de.y,
              n2 * n2 * pe.z + 2 * n2 * t2 * fe.z + t2 * t2 * de.z
            );
            le.identity();
            e3.mesh.quaternion.copy(ce).slerp(le, t2);
            ue.setFromAxisAngle(
              me.set(0, 0, 1),
              Math.sin(Math.PI * t2) * 0.18 * (a.side || a.vert || 1)
            );
            e3.mesh.quaternion.multiply(ue);
            e3.mesh.scale.setScalar(Dt.lerp(i2, w.cellH, t2));
          }
          if (e3.mesh.renderOrder = Math.round(e3.mesh.position.z * 100), e3.hover += (+(n === ee) - e3.hover) * (1 - Math.exp(-10 * t)), e3.mat.uniforms.uHover.value = e3.hover, e3.mesh.scale.multiplyScalar(1 + e3.hover * 0.05), e3.mat.uniforms.uOpacity.value = r2.opacity, e3.mesh.visible = r2.opacity > 1e-3, !e3.videoTex && e3.thumbs.length > 1) {
            let t2 = Math.floor((be + n * 0.7) / 2.4) % 3;
            t2 !== e3.thumbIdx && e3.thumbs[t2] && (e3.thumbIdx = t2, e3.mat.uniforms.map.value = e3.thumbs[t2]);
          }
        }), u.updateMatrixWorld(true), ie(), r.style.cursor = ee >= 0 ? `pointer` : ``, i)
          if (ee >= 0) {
            let e3 = x[ee].project;
            i.dataset.id !== e3.id && (i.dataset.id = e3.id, i.querySelector(`[data-t]`).textContent = e3.title, i.querySelector(`[data-s]`).textContent = e3.subtitle, i.querySelector(`[data-c]`).textContent = e3.category);
            i.style.opacity = `1`;
            i.style.transform = `translate(${Math.max(8, Math.min(te + 18, S - i.offsetWidth - 8))}px, ${Math.max(8, Math.min(ne + 18, C - i.offsetHeight - 8))}px)`;
          } else i.style.opacity = `0`;
        ye -= t;
        ye <= 0 && (ye = 0.25, ge.multiplyMatrices(d.projectionMatrix, d.matrixWorldInverse), he.setFromProjectionMatrix(ge), x.forEach((t2) => {
          if (!t2.video || t2.failed) return;
          let n = Math.hypot(previewAspectRatio, 1) * t2.mesh.scale.x * 0.5, r2 = t2.mat.uniforms.uOpacity.value > 0.01 && he.intersectsSphere(new Sr(t2.mesh.position, n * 1.4));
          t2.farTime = !he.intersectsSphere(new Sr(t2.mesh.position, n * 2)) || t2.mat.uniforms.uOpacity.value < 1e-3 ? t2.farTime + 0.25 : 0;
          t2.wanted = kd(r2, t2.farTime > 1, t2.playing || t2.pending, O);
          t2.wanted ? M(t2, e2) : (t2.playing || t2.pending) && (t2.video.pause(), t2.playing = false);
        }));
        s.render(u, d);
        r.setAttribute(`data-scene-ready`, `1`);
      }
    };
    ve = requestAnimationFrame(xe);
    return () => {
      cancelAnimationFrame(ve);
      j.disconnect();
      window.removeEventListener(`resize`, T);
      window.removeEventListener(`scroll`, k);
      document.removeEventListener(`pointerdown`, N);
      document.removeEventListener(`visibilitychange`, P);
      r.removeEventListener(`pointermove`, R);
      r.removeEventListener(`pointerleave`, z);
      r.removeEventListener(`pointerdown`, B);
      r.removeEventListener(`pointerup`, V);
      x.forEach((e2) => {
        e2.mat.dispose();
        e2.thumbs.forEach((e3) => e3 && e3.dispose());
        e2.videoTex?.dispose();
        e2.cleanupVideo();
        e2.video && (e2.video.pause(), e2.video.removeAttribute(`src`), e2.video.load());
      });
      _.dispose();
      y.dispose();
      s.dispose();
      s.domElement.remove();
    };
  }, []);
  let l = /* @__PURE__ */ jsxs(
    "div",
    {
      "data-project-heading": true,
      className: "flex flex-col items-center text-center",
      children: [
        /* @__PURE__ */ jsx("span", { className: "text-[#a31515] font-bold uppercase text-sm md:text-base tracking-[0.2em] mb-2", children: `Featured Works` }),
        /* @__PURE__ */ jsx("h2", { className: "text-5xl md:text-7xl font-black tracking-tight uppercase text-white", children: `PROJECTS.` }),
       
       
      ]
    }
  );
  return showFallback ? /* @__PURE__ */ jsxs(
    "section",
    {
      id: "projects",
      ref: sectionRef,
      className: "relative w-full text-gray-100 py-28 px-4 md:px-10 border-t border-white/5",
      children: [
        l,
        /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: projects.map((t) => /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            "data-project-fallback": true,
            onClick: () => onSelectProject(t),
            className: "glass glass-panel-card h-auto p-0 block whitespace-normal rounded-2xl overflow-hidden text-left group",
            children: [
              /* @__PURE__ */ jsx(ProjectCard, { project: t }),
              /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-[0.2em] text-red-400 font-bold", children: t.category }),
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-black text-white mt-1", children: t.title }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm mt-1", children: t.subtitle })
              ] })
            ]
          },
          t.id
        )) })
      ]
    }
  ) : /* @__PURE__ */ jsx(
    "section",
    {
      id: "projects",
      ref: sectionRef,
      className: "relative w-full text-gray-100 border-t border-white/5",
      style: {
        height: `420vh`
      },
      children: /* @__PURE__ */ jsxs("div", { className: "sticky top-0 h-screen w-full overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-24 md:top-24 z-20 px-4 pointer-events-none", children: l }),
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: canvasContainerRef,
            className: "absolute inset-0 z-10",
            "data-no-ripple": true,
            "aria-label": "Featured projects",
            role: "region"
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            ref: tooltipRef,
            className: "pointer-events-none absolute left-0 top-0 z-30 glass rounded-xl px-4 py-3 transition-opacity duration-200 max-w-[16rem]",
            style: {
              opacity: 0
            },
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  "data-c": true,
                  className: "block text-[10px] uppercase tracking-[0.2em] text-red-400 font-bold"
                }
              ),
              /* @__PURE__ */ jsx(
                "span",
                {
                  "data-t": true,
                  className: "block text-base font-black text-white leading-tight mt-0.5"
                }
              ),
              /* @__PURE__ */ jsx("span", { "data-s": true, className: "block text-xs text-gray-400 mt-0.5" })
            ]
          }
        )
      ] })
    }
  );
};
export {
  FeaturedWork
};
