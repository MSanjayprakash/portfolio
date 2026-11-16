import { jsx } from "../jsx-runtime.js";
import { React } from "../runtime.js";
const bF = 160;
const xF = 24;
const SF = 14;
const CF = `255,255,255`;
const wF = `255,32,32`;
const TF = `160,0,18`;
function EF(e, t, n, r, i) {
  i.length = 0;
  let a = 4 + Math.floor(Math.random() * 4), o = e, s = t;
  i.push(o, s);
  for (let e2 = 1; e2 <= a; e2++) {
    let e3 = n + (Math.random() - 0.5) * 1.1, t2 = r / a;
    o += Math.cos(e3) * t2;
    s += Math.sin(e3) * t2;
    i.push(o, s);
  }
}
function ParticleBackground() {
  let e = React.useRef(null);
  React.useEffect(() => {
    let t = e.current;
    if (!t || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches || !window.matchMedia(`(pointer: fine)`).matches)
      return;
    let n = t.getContext(`2d`);
    if (!n) return;
    let r = Array.from(
      {
        length: bF
      },
      () => ({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        max: 1,
        size: 1,
        hot: false
      })
    ), i = Array.from(
      {
        length: xF
      },
      () => ({
        pts: [],
        life: 0,
        max: 1,
        width: 1,
        bright: false
      })
    ), a = [], o = 0, s = 0, c = -9999, l = -9999, u = -9999, d = -9999, f = 0, p = 0, m = 0, h = false, g = performance.now(), _ = 1, v = () => {
      _ = Math.min(window.devicePixelRatio || 1, 2);
      t.width = Math.round(window.innerWidth * _);
      t.height = Math.round(window.innerHeight * _);
    };
    v();
    let y = (e2, t2, n2, i2, a2) => {
      let s2 = r[o];
      o = (o + 1) % bF;
      let c2 = Math.atan2(i2, n2) + Math.PI + (Math.random() - 0.5) * 2.6, l2 = 0.05 + Math.random() * 0.25 * (0.5 + a2);
      s2.x = e2;
      s2.y = t2;
      s2.vx = Math.cos(c2) * l2 + n2 * 0.02;
      s2.vy = Math.sin(c2) * l2 + i2 * 0.02;
      s2.max = s2.life = 250 + Math.random() * 400;
      s2.size = 0.6 + Math.random() * 1.6;
      s2.hot = Math.random() < 0.15;
    }, b = (e2, t2, n2, r2) => {
      let a2 = i[s];
      s = (s + 1) % xF;
      EF(
        e2,
        t2,
        Math.random() * Math.PI * 2,
        (10 + Math.random() * 28) * (r2 ? 1.8 : 1) * (0.6 + n2 * 0.6),
        a2.pts
      );
      a2.max = a2.life = r2 ? 160 : 70 + Math.random() * 80;
      a2.width = r2 ? 1.6 : 0.6 + Math.random() * 0.8;
      a2.bright = r2;
    }, x = (e2) => {
      if (e2.pointerType !== `mouse`) return;
      c = e2.clientX;
      l = e2.clientY;
      u < -999 && (u = c, d = l);
      let t2 = c - u, n2 = l - d, r2 = Math.hypot(t2, n2);
      f = Math.min(1.5, f * 0.6 + r2 / 40);
      let i2 = performance.now();
      a.push({
        x: c,
        y: l,
        t: i2
      });
      a.length > SF && a.shift();
      let o2 = Math.min(8, Math.floor(r2 / 6) + +(Math.random() < 0.4));
      for (let e3 = 0; e3 < o2; e3++) {
        let e4 = Math.random();
        y(u + t2 * e4, d + n2 * e4, t2, n2, f);
      }
      Math.random() < 0.15 + f * 0.4 && b(c, l, f, false);
      r2 > 45 && Math.random() < 0.25 && b(c, l, f, true);
      p = Math.min(1, p + r2 / 120);
      u = c;
      d = l;
      h || (h = true, g = i2, m = requestAnimationFrame(S));
    }, S = (e2) => {
      let t2 = Math.min(48, e2 - g);
      g = e2;
      n.setTransform(_, 0, 0, _, 0, 0);
      n.clearRect(0, 0, window.innerWidth, window.innerHeight);
      n.globalCompositeOperation = `lighter`;
      let o2 = false;
      if (p *= 0.992 ** t2, p > 0.02) {
        o2 = true;
        let e3 = n.createRadialGradient(c, l, 0, c, l, 70);
        e3.addColorStop(0, `rgba(255,0,30,${0.14 * p})`);
        e3.addColorStop(1, `rgba(255,0,30,0)`);
        n.fillStyle = e3;
        n.fillRect(c - 70, l - 70, 140, 140);
      }
      for (; a.length && e2 - a[0].t > 220; ) a.shift();
      if (a.length > 1) {
        o2 = true;
        n.lineCap = `round`;
        for (let t3 = 1; t3 < a.length; t3++) {
          let r2 = 1 - (e2 - a[t3].t) / 220;
          n.strokeStyle = `rgba(${TF},${r2 * 0.6})`;
          n.lineWidth = 3 * r2;
          n.beginPath();
          n.moveTo(a[t3 - 1].x, a[t3 - 1].y);
          n.lineTo(a[t3].x, a[t3].y);
          n.stroke();
          n.strokeStyle = `rgba(${wF},${r2 * 0.5})`;
          n.lineWidth = 0.8 * r2;
          n.stroke();
        }
      }
      for (let e3 of i) {
        if (e3.life <= 0) continue;
        e3.life -= t2;
        o2 = true;
        let r2 = Math.max(0, e3.life / e3.max) * (Math.random() < 0.25 ? 0.4 : 1);
        n.beginPath();
        n.moveTo(e3.pts[0], e3.pts[1]);
        for (let t3 = 2; t3 < e3.pts.length; t3 += 2)
          n.lineTo(e3.pts[t3], e3.pts[t3 + 1]);
        n.shadowBlur = e3.bright ? 14 : 8;
        n.shadowColor = `rgba(255,0,30,0.35)`;
        n.strokeStyle = `rgba(${wF},${r2 * 0.85})`;
        n.lineWidth = e3.width * 2;
        n.stroke();
        n.shadowBlur = 0;
        n.strokeStyle = `rgba(${CF},${r2 * (e3.bright ? 0.8 : 0.45)})`;
        n.lineWidth = e3.width * 0.5;
        n.stroke();
      }
      for (let e3 of r) {
        if (e3.life <= 0) continue;
        e3.life -= t2;
        o2 = true;
        let r2 = Math.max(0, e3.life / e3.max), i2 = e3.x, a2 = e3.y;
        e3.x += e3.vx * t2;
        e3.y += e3.vy * t2;
        e3.vx *= 0.985;
        e3.vy *= 0.985;
        n.strokeStyle = `rgba(${e3.hot ? CF : wF},${r2 * 0.9})`;
        n.lineWidth = e3.size * r2;
        n.beginPath();
        n.moveTo(i2 - e3.vx * 18, a2 - e3.vy * 18);
        n.lineTo(e3.x, e3.y);
        n.stroke();
      }
      f *= 0.95 ** (t2 / 16);
      o2 ? m = requestAnimationFrame(S) : (h = false, n.clearRect(0, 0, window.innerWidth, window.innerHeight));
    };
    window.addEventListener(`pointermove`, x, {
      passive: true
    });
    window.addEventListener(`resize`, v);
    return () => {
      cancelAnimationFrame(m);
      window.removeEventListener(`pointermove`, x);
      window.removeEventListener(`resize`, v);
    };
  }, []);
  return /* @__PURE__ */ jsx("canvas", { ref: e, className: "spark-cursor", "aria-hidden": "true" });
}
export {
  ParticleBackground
};
