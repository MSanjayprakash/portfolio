import { React } from "../runtime.js";
const bF = 160;
const xF = 24;
const SF = 14;
const CF = `255,255,255`;
const wF = `255,32,32`;
const TF = `160,0,18`;
function EF(e, t, n, r, i) {
  i.length = 0;
  let a = 4 + Math.floor(Math.random() * 4),
    o = e,
    s = t;
  i.push(o, s);
  for (let e = 1; e <= a; e++) {
    let e = n + (Math.random() - 0.5) * 1.1,
      t = r / a;
    o += Math.cos(e) * t;
    s += Math.sin(e) * t;
    i.push(o, s);
  }
}
function ParticleBackground() {
  let e = React.useRef(null);
  React.useEffect(() => {
    let t = e.current;
    if (
      !t ||
      window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ||
      !window.matchMedia(`(pointer: fine)`).matches
    )
      return;
    let n = t.getContext(`2d`);
    if (!n) return;
    let r = Array.from(
        {
          length: bF,
        },
        () => ({
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          life: 0,
          max: 1,
          size: 1,
          hot: false,
        }),
      ),
      i = Array.from(
        {
          length: xF,
        },
        () => ({
          pts: [],
          life: 0,
          max: 1,
          width: 1,
          bright: false,
        }),
      ),
      a = [],
      o = 0,
      s = 0,
      c = -9999,
      l = -9999,
      u = -9999,
      d = -9999,
      f = 0,
      p = 0,
      m = 0,
      h = false,
      g = performance.now(),
      _ = 1,
      v = () => {
        _ = Math.min(window.devicePixelRatio || 1, 2);
        t.width = Math.round(window.innerWidth * _);
        t.height = Math.round(window.innerHeight * _);
      };
    v();
    let y = (e, t, n, i, a) => {
        let s = r[o];
        o = (o + 1) % bF;
        let c = Math.atan2(i, n) + Math.PI + (Math.random() - 0.5) * 2.6,
          l = 0.05 + Math.random() * 0.25 * (0.5 + a);
        s.x = e;
        s.y = t;
        s.vx = Math.cos(c) * l + n * 0.02;
        s.vy = Math.sin(c) * l + i * 0.02;
        s.max = s.life = 250 + Math.random() * 400;
        s.size = 0.6 + Math.random() * 1.6;
        s.hot = Math.random() < 0.15;
      },
      b = (e, t, n, r) => {
        let a = i[s];
        s = (s + 1) % xF;
        EF(
          e,
          t,
          Math.random() * Math.PI * 2,
          (10 + Math.random() * 28) * (r ? 1.8 : 1) * (0.6 + n * 0.6),
          a.pts,
        );
        a.max = a.life = r ? 160 : 70 + Math.random() * 80;
        a.width = r ? 1.6 : 0.6 + Math.random() * 0.8;
        a.bright = r;
      },
      x = (e) => {
        if (e.pointerType !== `mouse`) return;
        c = e.clientX;
        l = e.clientY;
        u < -999 && ((u = c), (d = l));
        let t = c - u,
          n = l - d,
          r = Math.hypot(t, n);
        f = Math.min(1.5, f * 0.6 + r / 40);
        let i = performance.now();
        a.push({
          x: c,
          y: l,
          t: i,
        });
        a.length > SF && a.shift();
        let o = Math.min(8, Math.floor(r / 6) + +(Math.random() < 0.4));
        for (let e = 0; e < o; e++) {
          let e = Math.random();
          y(u + t * e, d + n * e, t, n, f);
        }
        Math.random() < 0.15 + f * 0.4 && b(c, l, f, false);
        r > 45 && Math.random() < 0.25 && b(c, l, f, true);
        p = Math.min(1, p + r / 120);
        u = c;
        d = l;
        h || ((h = true), (g = i), (m = requestAnimationFrame(S)));
      },
      S = (e) => {
        let t = Math.min(48, e - g);
        g = e;
        n.setTransform(_, 0, 0, _, 0, 0);
        n.clearRect(0, 0, window.innerWidth, window.innerHeight);
        n.globalCompositeOperation = `lighter`;
        let o = false;
        if (((p *= 0.992 ** t), p > 0.02)) {
          o = true;
          let e = n.createRadialGradient(c, l, 0, c, l, 70);
          e.addColorStop(0, `rgba(255,0,30,${0.14 * p})`);
          e.addColorStop(1, `rgba(255,0,30,0)`);
          n.fillStyle = e;
          n.fillRect(c - 70, l - 70, 140, 140);
        }
        for (; a.length && e - a[0].t > 220;) a.shift();
        if (a.length > 1) {
          o = true;
          n.lineCap = `round`;
          for (let t = 1; t < a.length; t++) {
            let r = 1 - (e - a[t].t) / 220;
            n.strokeStyle = `rgba(${TF},${r * 0.6})`;
            n.lineWidth = 3 * r;
            n.beginPath();
            n.moveTo(a[t - 1].x, a[t - 1].y);
            n.lineTo(a[t].x, a[t].y);
            n.stroke();
            n.strokeStyle = `rgba(${wF},${r * 0.5})`;
            n.lineWidth = 0.8 * r;
            n.stroke();
          }
        }
        for (let e of i) {
          if (e.life <= 0) continue;
          e.life -= t;
          o = true;
          let r =
            Math.max(0, e.life / e.max) * (Math.random() < 0.25 ? 0.4 : 1);
          n.beginPath();
          n.moveTo(e.pts[0], e.pts[1]);
          for (let t = 2; t < e.pts.length; t += 2)
            n.lineTo(e.pts[t], e.pts[t + 1]);
          n.shadowBlur = e.bright ? 14 : 8;
          n.shadowColor = `rgba(255,0,30,0.35)`;
          n.strokeStyle = `rgba(${wF},${r * 0.85})`;
          n.lineWidth = e.width * 2;
          n.stroke();
          n.shadowBlur = 0;
          n.strokeStyle = `rgba(${CF},${r * (e.bright ? 0.8 : 0.45)})`;
          n.lineWidth = e.width * 0.5;
          n.stroke();
        }
        for (let e of r) {
          if (e.life <= 0) continue;
          e.life -= t;
          o = true;
          let r = Math.max(0, e.life / e.max),
            i = e.x,
            a = e.y;
          e.x += e.vx * t;
          e.y += e.vy * t;
          e.vx *= 0.985;
          e.vy *= 0.985;
          n.strokeStyle = `rgba(${e.hot ? CF : wF},${r * 0.9})`;
          n.lineWidth = e.size * r;
          n.beginPath();
          n.moveTo(i - e.vx * 18, a - e.vy * 18);
          n.lineTo(e.x, e.y);
          n.stroke();
        }
        f *= 0.95 ** (t / 16);
        o
          ? (m = requestAnimationFrame(S))
          : ((h = false),
            n.clearRect(0, 0, window.innerWidth, window.innerHeight));
      };
    window.addEventListener(`pointermove`, x, {
      passive: true,
    });
    window.addEventListener(`resize`, v);
    return () => {
      cancelAnimationFrame(m);
      window.removeEventListener(`pointermove`, x);
      window.removeEventListener(`resize`, v);
    };
  }, []);
  return <canvas ref={e} className="spark-cursor" aria-hidden="true" />;
}
export { ParticleBackground };
