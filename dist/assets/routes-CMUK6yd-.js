const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ["assets/App.js", "assets/index-BA2SoYaj.js"]),
) => i.map((i) => d[i]);
import { a as e, i as t, n, r, t as i } from "./index-BA2SoYaj.js";
var a = e(t()),
  o = r(),
  s = (0, a.lazy)(() =>
    i(() => import("./App.js"), __vite__mapDeps([0, 1])),
  );
function c() {
  let e = (0, o.jsx)(`div`, { className: `min-h-screen bg-spider-dark` });
  return (0, o.jsx)(n, {
    fallback: e,
    children: (0, o.jsx)(a.Suspense, {
      fallback: e,
      children: (0, o.jsx)(s, {}),
    }),
  });
}
export { c as component };
