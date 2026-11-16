import { React } from "../runtime.js";
import { gsap } from "../vendor/portfolio-libraries.js";
function useScrollReveal(e, t) {
  React.useEffect(() => {
    let n = e.current;
    if (!n) return;
    let r = window.matchMedia(`(prefers-reduced-motion: reduce)`),
      i = () => {},
      a = () => {
        if ((i(), r.matches)) return;
        let e = Array.from(n.querySelectorAll(t)),
          a = e.map((e) => e.dataset.revealVisible),
          o = gsap.context(() => {
            gsap.set(e, {
              opacity: 0,
              y: 20,
              filter: `blur(12px)`,
            });
          }, n),
          s;
        o.add(() => {
          s = new IntersectionObserver(
            (t) => {
              t.forEach((t) => {
                let n = t.target,
                  r = t.isIntersecting;
                n.dataset.revealVisible !== String(r) &&
                  ((n.dataset.revealVisible = String(r)),
                  gsap.to(n, {
                    opacity: +!!r,
                    y: r ? 0 : 20,
                    filter: r ? `blur(0px)` : `blur(12px)`,
                    duration: r ? 0.8 : 0.65,
                    delay: r ? Math.min((e.indexOf(n) % 5) * 0.055, 0.22) : 0,
                    ease: `power3.out`,
                    overwrite: `auto`,
                  }));
              });
            },
            {
              threshold: 0,
              rootMargin: `-4% 0px -4% 0px`,
            },
          );
          e.forEach((e) => s?.observe(e));
        });
        i = () => {
          s?.disconnect();
          gsap.killTweensOf(e);
          o.revert();
          e.forEach((e, t) => {
            a[t] === void 0
              ? delete e.dataset.revealVisible
              : (e.dataset.revealVisible = a[t]);
          });
        };
      };
    a();
    r.addEventListener(`change`, a);
    return () => {
      i();
      r.removeEventListener(`change`, a);
    };
  }, [e, t]);
}
export { useScrollReveal };
