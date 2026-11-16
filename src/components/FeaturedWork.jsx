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
  PerspectiveCamera,
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
    [2, 2.2, -34],
  ],
  RAIL_MOBILE: [
    [0, 3, -50],
    [-4, 1.5, -26],
    [-3.5, 0, -8],
    [0, -0.6, 2.5],
    [3.5, 0, -8],
    [4, 1.5, -24],
    [1, 2.4, -32],
  ],
};
const lx = (e) => Math.max(0, Math.min(1, e));
const ux = (e) => (e < 0.5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2);
function dx(e) {
  return cx.RAIL_SPAN + cx.FLY_SPAN + (e - 1) * cx.SPACING + cx.HOLD;
}
function fx(e, t, n) {
  let r = lx(e) * dx(n) - t * cx.SPACING;
  return {
    rail: lx(r / cx.RAIL_SPAN),
    fly: lx((r - cx.RAIL_SPAN) / cx.FLY_SPAN),
    opacity: r <= 0 ? 0 : Math.min(1, r / 0.12),
  };
}
function px(e, t, n, r, i) {
  let a = 2 * i * Math.tan(((r / 2) * Math.PI) / 180),
    o = t / n,
    s = a * o,
    c = o < 0.8 ? 2 : 3,
    l = Math.ceil(e / c),
    u = a * (o < 0.8 ? 0.34 : 0.4),
    d = a - u - a * 0.04,
    f = Math.min(s, a) * 0.025,
    p = 16 / 9,
    m = Math.min((s * 0.92 - f * (c - 1)) / c, ((d - f * (l - 1)) / l) * p);
  m = Math.max(m, 0.5);
  let h = m / p,
    g = c * m + (c - 1) * f,
    _ = l * h + (l - 1) * f,
    v = a / 2 - u - (d - _) / 2;
  return {
    cells: Array.from(
      {
        length: e,
      },
      (e, t) => {
        let n = t % c,
          r = Math.floor(t / c);
        return {
          x: -g / 2 + m / 2 + n * (m + f),
          y: v - h / 2 - r * (h + f),
          side: c > 1 && n === 0 ? -1 : +(c > 1 && n === c - 1),
          vert: r === 0 ? 1 : r === l - 1 ? -1 : 0,
        };
      },
    ),
    cellW: m,
    cellH: h,
    cols: c,
    rows: l,
  };
}
function ProjectCard({ project: e }) {
  let t = React.useRef(null),
    n = React.useRef(null),
    [a, o] = React.useState(false);
  React.useEffect(() => {
    let r = t.current,
      i = n.current;
    if (!r || !i || !e.videoUrl) return;
    let a = false,
      s = false,
      c = () => {
        !a ||
          s ||
          document.hidden ||
          ((i.preload = `auto`), (i.muted = true), i.play().catch(() => {}));
      },
      l = new IntersectionObserver(
        ([e]) => {
          a = e?.isIntersecting ?? false;
          a ? c() : i.pause();
        },
        {
          rootMargin: `250px`,
        },
      );
    l.observe(r);
    let u = () => {
        document.hidden ? i.pause() : c();
      },
      d = () => {
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
  return (
    <div ref={t} className="project-video-fallback" data-video-ready={a}>
      <img src={e.poster} alt="" loading="lazy" />
      <video
        ref={n}
        src={e.videoUrl ? encodeURI(e.videoUrl) : void 0}
        poster={e.poster}
        muted={true}
        loop={true}
        playsInline={true}
        preload="metadata"
        onPlaying={() => o(true)}
        aria-label={e.title}
      />
    </div>
  );
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
  return t ? [1, 2, 3].map((e) => `${t[1]}-${e}.${t[2]}`) : [e.poster];
}
const FeaturedWork = ({ onSelectProject: onSelectProject }) => {
  let sectionRef = React.useRef(null),
    canvasContainerRef = React.useRef(null),
    tooltipRef = React.useRef(null),
    selectProjectRef = React.useRef(onSelectProject);
  selectProjectRef.current = onSelectProject;
  let [showFallback, setShowFallback] = React.useState(false);
  useScrollReveal(
    sectionRef,
    `[data-project-heading] > *, [data-project-fallback]`,
  );
  React.useEffect(() => {
    if (window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) {
      setShowFallback(true);
      return;
    }
    let e = sectionRef.current,
      r = canvasContainerRef.current,
      i = tooltipRef.current;
    if (!e || !r) return;
    let s;
    try {
      s = new WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: `high-performance`,
      });
    } catch {
      setShowFallback(true);
      return;
    }
    let l = window.matchMedia(`(max-width: 768px), (pointer: coarse)`).matches;
    s.setPixelRatio(Math.min(window.devicePixelRatio || 1, l ? 1.5 : 2));
    s.setClearColor(0, 0);
    r.appendChild(s.domElement);
    s.domElement.style.cssText = `position:absolute;inset:0;width:100%;height:100%;display:block`;
    let u = new Scene(),
      d = new PerspectiveCamera(cx.FOV, 1, 0.1, 200);
    d.position.set(0, 0, cx.CAM_Z);
    let p = new ra(
        (l ? cx.RAIL_MOBILE : cx.RAIL).map(([e, t, n]) => new J(e, t, n)),
        false,
        `centripetal`,
      ),
      m = [],
      h = [];
    for (let e = 0; e <= 400; e++)
      (m.push(p.getPointAt(e / 400)), h.push(p.getTangentAt(e / 400)));
    let g = (e, t, n) => {
        let r = Math.max(0, Math.min(1, e)) * 400,
          i = Math.min(Math.floor(r), 399),
          a = r - i;
        t.lerpVectors(m[i], m[i + 1], a);
        n.lerpVectors(h[i], h[i + 1], a).normalize();
      },
      _ = new fo(previewAspectRatio, 1, 24, 14),
      v = new $o(),
      y = new ri(new Uint8Array([10, 8, 10, 255]), 1, 1);
    y.needsUpdate = true;
    let b = (e, t, n) => {
        let r = t / n;
        if (r > previewAspectRatio) {
          let t = previewAspectRatio / r;
          e.uniforms.uvScale.value.set(t, 1);
          e.uniforms.uvOffset.value.set((1 - t) / 2, 0);
        } else {
          let t = r / previewAspectRatio;
          e.uniforms.uvScale.value.set(1, t);
          e.uniforms.uvOffset.value.set(0, (1 - t) / 2);
        }
      },
      x = projects.map((e, t) => {
        let n = new xo({
            vertexShader: cardVertexShader,
            fragmentShader: cardFragmentShader,
            transparent: true,
            side: 2,
            depthWrite: false,
            uniforms: {
              map: {
                value: y,
              },
              uvScale: {
                value: new q(1, 1),
              },
              uvOffset: {
                value: new q(),
              },
              uOpacity: {
                value: 0,
              },
              uHover: {
                value: 0,
              },
              uReady: {
                value: 0,
              },
            },
          }),
          r = new ei(_, n);
        r.userData.index = t;
        u.add(r);
        let i = {
          project: e,
          mesh: r,
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
          cleanupVideo: () => {},
        };
        if (
          (getPosterVariants(e).forEach((e, t) => {
            v.load(e, (e) => {
              e.minFilter = f;
              e.generateMipmaps = false;
              i.thumbs[t] = e;
              !i.videoTex &&
                t === 0 &&
                ((n.uniforms.map.value = e),
                b(n, e.image.width, e.image.height),
                (n.uniforms.uReady.value = 1));
            });
          }),
          e.videoUrl)
        ) {
          let t = document.createElement(`video`);
          t.muted = true;
          t.loop = true;
          t.playsInline = true;
          t.autoplay = false;
          t.preload = `metadata`;
          t.setAttribute(`playsinline`, ``);
          t.setAttribute(`muted`, ``);
          t.src = encodeURI(e.videoUrl);
          let r = () => {
              if (i.failed || i.videoTex) return;
              let e = new Li(t);
              e.minFilter = f;
              e.generateMipmaps = false;
              i.videoTex = e;
              b(n, t.videoWidth || 16, t.videoHeight || 9);
            },
            a = () => {
              i.videoTex || r();
              i.videoTex &&
                ((n.uniforms.map.value = i.videoTex),
                (n.uniforms.uReady.value = 1));
              i.playing = true;
            },
            o = () => {
              i.failed = true;
              i.playing = false;
              i.pending = false;
              i.thumbs[0] &&
                ((n.uniforms.map.value = i.thumbs[0]),
                b(n, i.thumbs[0].image.width, i.thumbs[0].image.height));
            };
          t.addEventListener(`loadeddata`, r);
          t.addEventListener(`playing`, a);
          t.addEventListener(`error`, o);
          i.cleanupVideo = () => {
            t.removeEventListener(`loadeddata`, r);
            t.removeEventListener(`playing`, a);
            t.removeEventListener(`error`, o);
          };
          i.video = t;
        }
        return i;
      }),
      S = 1,
      C = 1,
      w = null,
      T = () => {
        S = r.clientWidth;
        C = r.clientHeight;
        s.setSize(S, C, false);
        d.aspect = S / C;
        d.updateProjectionMatrix();
        w = px(x.length, S, C, cx.FOV, cx.CAM_Z);
      };
    T();
    window.addEventListener(`resize`, T);
    let E = 0,
      D = 0,
      O = false,
      k = () => {
        let t = e.getBoundingClientRect(),
          n = t.height - window.innerHeight;
        E = n > 0 ? Math.max(0, Math.min(1, -t.top / n)) : 0;
      };
    k();
    window.addEventListener(`scroll`, k, {
      passive: true,
    });
    let A = () =>
        x.forEach((e) => {
          e.wanted = false;
          e.video?.pause();
          e.playing = false;
        }),
      j = new IntersectionObserver(
        ([e]) => {
          O = e.isIntersecting;
          O || A();
        },
        {
          rootMargin: `250px`,
        },
      );
    j.observe(r);
    let M = (e, t) => {
        !e.video ||
          e.failed ||
          e.pending ||
          e.playing ||
          !e.wanted ||
          t < e.retryAt ||
          document.hidden ||
          ((e.pending = true),
          (e.video.muted = true),
          (e.video.preload = `auto`),
          e.video
            .play()
            .then(() => {
              e.pending = false;
              !e.wanted || document.hidden
                ? (e.video.pause(), (e.playing = false))
                : (e.playing = true);
            })
            .catch(() => {
              e.pending = false;
              e.playing = false;
              e.retryAt = performance.now() + 3e3;
            }));
      },
      N = () =>
        x.forEach((e) => {
          e.retryAt = 0;
          M(e, performance.now());
        }),
      P = () => {
        document.hidden ? A() : (ye = 0);
      };
    document.addEventListener(`pointerdown`, N);
    document.addEventListener(`visibilitychange`, P);
    let F = new Is(),
      I = new q(9, 9),
      ee = -1,
      te = 0,
      ne = 0,
      re = 0,
      L = 0,
      R = (e) => {
        let t = r.getBoundingClientRect();
        te = e.clientX - t.left;
        ne = e.clientY - t.top;
        I.set((te / t.width) * 2 - 1, -(ne / t.height) * 2 + 1);
      },
      z = () => I.set(9, 9),
      B = (e) => {
        re = e.clientX;
        L = e.clientY;
        R(e);
      },
      V = (e) => {
        Math.hypot(e.clientX - re, e.clientY - L) > 8 ||
          (R(e), ie(), ee >= 0 && selectProjectRef.current(x[ee].project));
      },
      ie = () => {
        F.setFromCamera(I, d);
        let e = F.intersectObjects(
          x
            .filter((e) => e.mat.uniforms.uOpacity.value > 0.3)
            .map((e) => e.mesh),
        );
        ee = e.length ? e[0].object.userData.index : -1;
      };
    r.addEventListener(`pointermove`, R);
    r.addEventListener(`pointerleave`, z);
    r.addEventListener(`pointerdown`, B);
    r.addEventListener(`pointerup`, V);
    let H = new J(),
      U = new J(),
      ae = new J(),
      W = new J(),
      oe = new J(0, 1, 0),
      se = new Qt(),
      ce = new Ot(),
      le = new Ot(),
      ue = new Ot(),
      de = new J(),
      fe = new J(),
      pe = new J(),
      me = new J(),
      he = new gi(),
      ge = new Qt(),
      _e = performance.now(),
      ve = 0,
      ye = 0,
      be = 0,
      xe = (e) => {
        ve = requestAnimationFrame(xe);
        let t = Math.min((e - _e) / 1e3, 0.05);
        if (((_e = e), !(!O || document.hidden))) {
          if (
            ((D += (E - D) * (1 - Math.exp(-7 * t))),
            Math.abs(E - D) < 1e-5 && (D = E),
            (be += t),
            x.forEach((e, n) => {
              let r = fx(D, n, x.length);
              g(r.rail, H, U);
              ae.set(U.x, 0, U.z);
              ae.lengthSq() < 1e-4 && ae.set(1, 0, 0);
              ae.normalize();
              W.crossVectors(ae, oe).normalize();
              W.z < 0 && W.negate();
              se.makeBasis(me.crossVectors(oe, W).normalize(), oe, W);
              ce.setFromRotationMatrix(se);
              let i = cx.CARD_W / previewAspectRatio,
                a = w.cells[n];
              if (r.fly <= 0)
                (e.mesh.position.copy(H),
                  e.mesh.quaternion.copy(ce),
                  e.mesh.scale.setScalar(i));
              else {
                g(1, pe, U);
                de.set(a.x, a.y, 0);
                fe.set(
                  a.x + a.side * w.cellW * 0.9,
                  a.y + a.vert * w.cellH * 1.6,
                  1.2,
                );
                let t = ux(r.fly),
                  n = 1 - t;
                e.mesh.position.set(
                  n * n * pe.x + 2 * n * t * fe.x + t * t * de.x,
                  n * n * pe.y + 2 * n * t * fe.y + t * t * de.y,
                  n * n * pe.z + 2 * n * t * fe.z + t * t * de.z,
                );
                le.identity();
                e.mesh.quaternion.copy(ce).slerp(le, t);
                ue.setFromAxisAngle(
                  me.set(0, 0, 1),
                  Math.sin(Math.PI * t) * 0.18 * (a.side || a.vert || 1),
                );
                e.mesh.quaternion.multiply(ue);
                e.mesh.scale.setScalar(Dt.lerp(i, w.cellH, t));
              }
              if (
                ((e.mesh.renderOrder = Math.round(e.mesh.position.z * 100)),
                (e.hover += (+(n === ee) - e.hover) * (1 - Math.exp(-10 * t))),
                (e.mat.uniforms.uHover.value = e.hover),
                e.mesh.scale.multiplyScalar(1 + e.hover * 0.05),
                (e.mat.uniforms.uOpacity.value = r.opacity),
                (e.mesh.visible = r.opacity > 0.001),
                !e.videoTex && e.thumbs.length > 1)
              ) {
                let t = Math.floor((be + n * 0.7) / 2.4) % 3;
                t !== e.thumbIdx &&
                  e.thumbs[t] &&
                  ((e.thumbIdx = t), (e.mat.uniforms.map.value = e.thumbs[t]));
              }
            }),
            u.updateMatrixWorld(true),
            ie(),
            (r.style.cursor = ee >= 0 ? `pointer` : ``),
            i)
          )
            if (ee >= 0) {
              let e = x[ee].project;
              i.dataset.id !== e.id &&
                ((i.dataset.id = e.id),
                (i.querySelector(`[data-t]`).textContent = e.title),
                (i.querySelector(`[data-s]`).textContent = e.subtitle),
                (i.querySelector(`[data-c]`).textContent = e.category));
              i.style.opacity = `1`;
              i.style.transform = `translate(${Math.max(8, Math.min(te + 18, S - i.offsetWidth - 8))}px, ${Math.max(8, Math.min(ne + 18, C - i.offsetHeight - 8))}px)`;
            } else i.style.opacity = `0`;
          ye -= t;
          ye <= 0 &&
            ((ye = 0.25),
            ge.multiplyMatrices(d.projectionMatrix, d.matrixWorldInverse),
            he.setFromProjectionMatrix(ge),
            x.forEach((t) => {
              if (!t.video || t.failed) return;
              let n = Math.hypot(previewAspectRatio, 1) * t.mesh.scale.x * 0.5,
                r =
                  t.mat.uniforms.uOpacity.value > 0.01 &&
                  he.intersectsSphere(new Sr(t.mesh.position, n * 1.4));
              t.farTime =
                !he.intersectsSphere(new Sr(t.mesh.position, n * 2)) ||
                t.mat.uniforms.uOpacity.value < 0.001
                  ? t.farTime + 0.25
                  : 0;
              t.wanted = kd(r, t.farTime > 1, t.playing || t.pending, O);
              t.wanted
                ? M(t, e)
                : (t.playing || t.pending) &&
                  (t.video.pause(), (t.playing = false));
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
      x.forEach((e) => {
        e.mat.dispose();
        e.thumbs.forEach((e) => e && e.dispose());
        e.videoTex?.dispose();
        e.cleanupVideo();
        e.video &&
          (e.video.pause(), e.video.removeAttribute(`src`), e.video.load());
      });
      _.dispose();
      y.dispose();
      s.dispose();
      s.domElement.remove();
    };
  }, []);
  let l = (
    <div
      data-project-heading={true}
      className="flex flex-col items-center text-center"
    >
      <span className="text-[#a31515] font-bold uppercase text-sm md:text-base tracking-[0.2em] mb-2">{`Featured Works`}</span>
      <h2 className="text-5xl md:text-7xl font-black tracking-tight uppercase text-white">{`PROJECTS.`}</h2>
      
      
    </div>
  );
  return showFallback ? (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full text-gray-100 py-28 px-4 md:px-10 border-t border-white/5"
    >
      {l}
      <div className="max-w-7xl mx-auto mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((t) => (
          <Button
            variant="ghost"
            data-project-fallback={true}
            onClick={() => onSelectProject(t)}
            className="glass glass-panel-card h-auto p-0 block whitespace-normal rounded-2xl overflow-hidden text-left group"
            key={t.id}
          >
            <ProjectCard project={t} />
            <div className="p-5">
              <span className="text-xs uppercase tracking-[0.2em] text-red-400 font-bold">
                {t.category}
              </span>
              <h3 className="text-xl font-black text-white mt-1">{t.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{t.subtitle}</p>
            </div>
          </Button>
        ))}
      </div>
    </section>
  ) : (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full text-gray-100 border-t border-white/5"
      style={{
        height: `420vh`,
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-x-0 top-24 md:top-24 z-20 px-4 pointer-events-none">
          {l}
        </div>
        <div
          ref={canvasContainerRef}
          className="absolute inset-0 z-10"
          data-no-ripple={true}
          aria-label="Featured projects"
          role="region"
        />
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute left-0 top-0 z-30 glass rounded-xl px-4 py-3 transition-opacity duration-200 max-w-[16rem]"
          style={{
            opacity: 0,
          }}
        >
          <span
            data-c={true}
            className="block text-[10px] uppercase tracking-[0.2em] text-red-400 font-bold"
          />
          <span
            data-t={true}
            className="block text-base font-black text-white leading-tight mt-0.5"
          />
          <span data-s={true} className="block text-xs text-gray-400 mt-0.5" />
        </div>
      </div>
    </section>
  );
};
export { FeaturedWork };
