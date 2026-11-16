import { React } from "../runtime.js";
import { clientMetrics } from "../data/portfolio.js";
import { gsap } from "../vendor/portfolio-libraries.js";
const ClientResults = () => {
  let sectionRef = React.useRef(null),
    headingRef = React.useRef(null);
  React.useEffect(() => {
    if (window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) return;
    let n = gsap.context(() => {
      let n = gsap.utils.toArray(`.stat-item`),
        r = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top 75%`,
            toggleActions: `play reverse play reverse`,
          },
        });
      r.fromTo(
        headingRef.current,
        {
          y: 20,
          opacity: 0,
          scale: 0.97,
          filter: `blur(12px)`,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: `blur(0px)`,
          duration: 0.9,
          ease: `power3.out`,
        },
      );
      n.forEach((e, t) => {
        let n = e.querySelector(`.stat-num`),
          i = e.querySelector(`.stat-fig`),
          a = e.querySelector(`.stat-bar`),
          o = e.querySelector(`.stat-label`);
        if (!n || !i || !a || !o) return;
        let s = Number(e.dataset.value),
          c = {
            v: 0,
          },
          l = 0.3 + t * 0.18;
        n.textContent = `0`;
        r.fromTo(
          i,
          {
            y: 28,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: `power3.out`,
          },
          l,
        )
          .fromTo(
            c,
            {
              v: 0,
            },
            {
              v: s,
              duration: 2.2,
              ease: `power3.out`,
              onUpdate: () => {
                n.textContent = String(Math.round(c.v));
              },
            },
            l,
          )
          .fromTo(
            a,
            {
              scaleX: 0,
            },
            {
              scaleX: 1,
              duration: 2.2,
              ease: `power3.out`,
            },
            l,
          )
          .fromTo(
            o,
            {
              y: 14,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: `power3.out`,
            },
            l + 0.25,
          );
      });
    }, sectionRef);
    return () => n.revert();
  }, []);
  React.useEffect(() => {
    let n = sectionRef.current,
      r = headingRef.current;
    if (
      !n ||
      !r ||
      !window.matchMedia(`(hover: hover) and (pointer: fine)`).matches
    )
      return;
    let i = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,
      a = {
        x: 0,
        y: 0,
        o: 0,
      },
      o = {
        x: 0,
        y: 0,
        o: 0,
      },
      s = performance.now(),
      c = false,
      l = () => {
        let e = performance.now(),
          t = Math.min((e - s) / 1e3, 0.05);
        s = e;
        let n = 1 - Math.exp(-(i ? 40 : 9) * t),
          c = 1 - Math.exp(-(i ? 40 : 5.5) * t);
        o.x += (a.x - o.x) * n;
        o.y += (a.y - o.y) * n;
        o.o += (a.o - o.o) * c;
        r.style.setProperty(`--mx`, `${o.x.toFixed(1)}px`);
        r.style.setProperty(`--my`, `${o.y.toFixed(1)}px`);
        r.style.setProperty(`--lo`, o.o.toFixed(3));
        a.o === 0 && o.o < 0.003 && (r.style.setProperty(`--lo`, `0`), d());
      },
      u = () => {
        c || ((c = true), (s = performance.now()), gsap.ticker.add(l));
      },
      d = () => {
        c && ((c = false), gsap.ticker.remove(l));
      },
      f = (e) => {
        if (e.pointerType === `touch`) return;
        let t = r.getBoundingClientRect();
        a.x = e.clientX - t.left;
        a.y = e.clientY - t.top;
        a.o === 0 && ((o.x = a.x), (o.y = a.y));
        a.o = 1;
        u();
      },
      p = () => {
        a.o = 0;
      };
    n.addEventListener(`pointermove`, f);
    n.addEventListener(`pointerleave`, p);
    return () => {
      n.removeEventListener(`pointermove`, f);
      n.removeEventListener(`pointerleave`, p);
      d();
    };
  }, []);
  return (
    <section
      id="stats"
      ref={sectionRef}
      aria-labelledby="stats-heading"
      className="relative w-full text-gray-100 py-20 md:py-28 px-5 md:px-10 lg:px-16 overflow-hidden border-t border-white/5"
    >
      <h2 id="stats-heading" className="sr-only">{`Client results`}</h2>
      <div
        ref={headingRef}
        className="stat-panel glass glass-panel-card relative z-10 max-w-7xl mx-auto rounded-3xl overflow-hidden"
      >
        <div className="stat-light" aria-hidden="true" />
        <div className="stat-rim" aria-hidden="true" />
        <dl className="relative z-10 m-0 grid grid-cols-3 divide-x divide-white/20">
          {clientMetrics.map((e) => (
            <div
              data-value={e.value}
              className="stat-item px-3 py-8 md:px-8 md:py-20 lg:px-10"
              key={e.id}
            >
              <div className="stat-cq flex flex-col-reverse items-center text-center gap-3 md:items-start md:text-left md:gap-6">
                <dt className="stat-label text-[10px] md:text-base font-semibold uppercase tracking-[0.16em] leading-snug text-gray-300">
                  {e.label}
                </dt>
                <dd className="m-0">
                  <span className="sr-only">
                    {e.value}
                    {e.suffix}
                  </span>
                  <div
                    aria-hidden="true"
                    className="stat-fig font-black uppercase text-white"
                  >
                    <span className="relative inline-block">
                      <span className="invisible">{e.value}</span>
                      <span className="stat-num absolute right-0 top-0">
                        {e.value}
                      </span>
                    </span>
                    <span className="stat-suffix">{e.suffix}</span>
                  </div>
                  <div
                    className="stat-bar mt-3 md:mt-6 w-8 md:w-12 h-1 bg-[#a31515] rounded-full origin-left"
                    aria-hidden="true"
                  />
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
export { ClientResults };
