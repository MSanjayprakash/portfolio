import {
  q,
  J,
  hr,
  Ar,
  Fi,
  xo,
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
} from "../vendor/portfolio-libraries.js";
import { React } from "../runtime.js";
const backgroundVertexShader = `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uTravel;
  uniform float uDepth;
  uniform vec2 uMouse;
  uniform float uSpeed;
  uniform float uPixelRatio;
  uniform float uClock;
  uniform float uAspect;
  uniform vec3 uClick[4];
  varying float vAlpha;
  varying float vSeed;
  varying float vSize;
  void main() {
    vec3 p = position;
    // idle organic drift
    p.x += sin(uTime * (0.12 + aSeed * 0.2) + aSeed * 31.0) * (0.4 + aSeed * 0.6);
    p.y += cos(uTime * (0.10 + aSeed * 0.18) + aSeed * 17.0) * (0.4 + aSeed * 0.6);
    // forward travel, wrapped into [-uDepth, 6]
    float z = p.z + uTravel + uTime * 0.25;
    z = mod(z + uDepth, uDepth + 6.0) - uDepth;
    p.z = z;
    // depth-based cursor parallax (near reacts more)
    float near = clamp((z + uDepth) / (uDepth + 6.0), 0.0, 1.0);
    p.xy += uMouse * near * near * 1.6;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // click repulsion: push away from click in screen space, ease back
    vec4 clip0 = projectionMatrix * mv;
    vec2 ndc = clip0.xy / clip0.w;
    for (int i = 0; i < 4; i++) {
      float age = uClock - uClick[i].z;
      if (age > 0.0 && age < 4.0) {
        vec2 d = ndc - uClick[i].xy;
        d.x *= uAspect;
        float dist = length(d);
        float reach = 0.15 + age * 0.55; // expanding wave
        float fall = exp(-dist * dist / (reach * reach * 0.35));
        float env = age * exp(-age * 2.2) * 6.0; // fast out, smooth return
        vec2 dir = dist > 0.0001 ? d / dist : vec2(0.0, 1.0);
        dir.x /= uAspect;
        mv.xy += dir * fall * env * 0.22 * -mv.z;
      }
    }
    gl_Position = projectionMatrix * mv;
    float pulse = 0.75 + 0.25 * sin(uTime * (0.6 + aSeed) + aSeed * 50.0);
    gl_PointSize = aSize * uPixelRatio * (1.0 + uSpeed * 0.6) * (60.0 / -mv.z) * (0.8 + near * near * 1.8);
    // fade in from far, fade out right before the camera
    float fadeFar = smoothstep(-uDepth, -uDepth + 14.0, z);
    float fadeNear = 1.0 - smoothstep(2.0, 5.5, z);
    vAlpha = fadeFar * fadeNear * pulse * (0.35 + aSeed * 0.65) * (0.55 + near * 0.75);
    vSeed = aSeed;
    vSize = aSize;
  }
`;
const backgroundFragmentShader = `
  varying float vAlpha;
  varying float vSeed;
  varying float vSize;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float core = exp(-d * d * 60.0);
    float halo = exp(-d * d * 7.0) * (0.35 + vSize * 0.04);
    float a = (core + halo) * vAlpha;
    if (a < 0.003) discard;
    vec3 col = mix(vec3(0.75, 0.03, 0.08), vec3(1.0, 0.32, 0.30), core * (0.4 + vSeed * 0.6));
    gl_FragColor = vec4(col * a, a);
  }
`;
const WebGLBackground = () => {
  let e = React.useRef(null);
  React.useEffect(() => {
    let t = e.current;
    if (!t) return;
    let n;
    try {
      n = new WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: `high-performance`,
      });
    } catch {
      return;
    }
    let r = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,
      i = window.matchMedia(`(max-width: 768px), (pointer: coarse)`).matches,
      a = Math.min(window.devicePixelRatio || 1, i ? 1.5 : 2);
    n.setPixelRatio(a);
    n.setClearColor(0, 0);
    t.appendChild(n.domElement);
    n.domElement.style.cssText = `position:absolute;inset:0;width:100%;height:100%;display:block`;
    let o = new Scene(),
      s = new PerspectiveCamera(60, 1, 0.1, 200);
    s.position.set(0, 0, 6);
    let c = i ? 900 : 2200,
      l = new Float32Array(c * 3),
      u = new Float32Array(c),
      d = new Float32Array(c);
    for (let e = 0; e < c; e++) {
      let t = Math.random() ** 0.7 * 26,
        n = Math.random() * Math.PI * 2;
      l[e * 3] = Math.cos(n) * t * 1.4 + (Math.random() - 0.5) * 4;
      l[e * 3 + 1] = Math.sin(n) * t * 0.9 + (Math.random() - 0.5) * 4;
      l[e * 3 + 2] = -Math.random() * 70;
      u[e] =
        Math.random() < 0.06
          ? 7 + Math.random() * 11
          : 1.1 + Math.random() * 3.4;
      d[e] = Math.random();
    }
    let f = new Ar();
    f.setAttribute(`position`, new hr(l, 3));
    f.setAttribute(`aSize`, new hr(u, 1));
    f.setAttribute(`aSeed`, new hr(d, 1));
    let p = new xo({
        vertexShader: backgroundVertexShader,
        fragmentShader: backgroundFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: 2,
        uniforms: {
          uTime: {
            value: 0,
          },
          uTravel: {
            value: 0,
          },
          uDepth: {
            value: 70,
          },
          uMouse: {
            value: new q(),
          },
          uSpeed: {
            value: 0,
          },
          uPixelRatio: {
            value: a,
          },
          uClock: {
            value: 0,
          },
          uAspect: {
            value: 1,
          },
          uClick: {
            value: [0, 1, 2, 3].map(() => new J(0, 0, -99)),
          },
        },
      }),
      m = new Fi(f, p);
    m.frustumCulled = false;
    o.add(m);
    let h = () => {
      let e = window.innerWidth,
        t = window.innerHeight;
      n.setSize(e, t, false);
      s.aspect = e / t;
      s.updateProjectionMatrix();
      p.uniforms.uAspect.value = e / t;
    };
    h();
    window.addEventListener(`resize`, h);
    let g = {
        x: 0,
        y: 0,
      },
      _ = (e) => {
        g.x = (e.clientX / window.innerWidth) * 2 - 1;
        g.y = -((e.clientY / window.innerHeight) * 2 - 1);
      },
      v = 0,
      y = (e) => {
        let n = e.target;
        if (
          !n ||
          n.closest?.(
            `a,button,input,textarea,select,label,video,img,nav,[role="button"],[data-no-ripple],.glass,.glass-chip,.glass-red`,
          )
        )
          return;
        let i = (e.clientX / window.innerWidth) * 2 - 1,
          a = -((e.clientY / window.innerHeight) * 2 - 1);
        if (
          (p.uniforms.uClick.value[v++ % 4].set(
            i,
            a,
            (performance.now() - w) / 1e3,
          ),
          r)
        )
          return;
        let o = document.createElement(`span`);
        o.className = `pf-ripple`;
        o.style.left = e.clientX + `px`;
        o.style.top = e.clientY + `px`;
        t.appendChild(o);
        o.addEventListener(`animationend`, () => o.remove(), {
          once: true,
        });
      };
    window.addEventListener(`pointerdown`, y, {
      passive: true,
    });
    window.addEventListener(`pointermove`, _, {
      passive: true,
    });
    let b = 0,
      x = 0,
      S = window.scrollY,
      C = 0,
      w = performance.now(),
      T = w,
      E = 0,
      D = (e) => {
        E = requestAnimationFrame(D);
        let t = Math.min((e - T) / 1e3, 0.05);
        T = e;
        let i = window.scrollY,
          a = i - S;
        S = i;
        x += a * 0.02;
        let c = b;
        b += (x - b) * (1 - Math.exp(-6 * t));
        let l = Math.min(Math.abs(b - c) / Math.max(t, 0.001) / 25, 1);
        C += (l - C) * (1 - Math.exp(-8 * t));
        let u = p.uniforms;
        u.uTime.value = r ? 0 : (e - w) / 1e3;
        u.uTravel.value = b;
        u.uSpeed.value = C;
        u.uClock.value = (e - w) / 1e3;
        u.uMouse.value.x += (g.x - u.uMouse.value.x) * (1 - Math.exp(-3 * t));
        u.uMouse.value.y += (g.y - u.uMouse.value.y) * (1 - Math.exp(-3 * t));
        n.render(o, s);
      };
    E = requestAnimationFrame(D);
    return () => {
      cancelAnimationFrame(E);
      window.removeEventListener(`resize`, h);
      window.removeEventListener(`pointermove`, _);
      window.removeEventListener(`pointerdown`, y);
      f.dispose();
      p.dispose();
      n.dispose();
      n.domElement.remove();
    };
  }, []);
  return (
    <div
      ref={e}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 bg-[#050507]"
    />
  );
};
export { WebGLBackground };
