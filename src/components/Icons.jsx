import { React } from "../runtime.js";
const Gb = (...e) =>
  e
    .filter((e, t, n) => !!e && e.trim() !== `` && n.indexOf(e) === t)
    .join(` `)
    .trim();
const Kb = (e) => e.replace(/([a-z0-9])([A-Z])/g, `$1-$2`).toLowerCase();
const qb = (e) =>
  e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) =>
    n ? n.toUpperCase() : t.toLowerCase(),
  );
const Jb = (e) => {
  let t = qb(e);
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const Yb = {
  xmlns: `http://www.w3.org/2000/svg`,
  width: 24,
  height: 24,
  viewBox: `0 0 24 24`,
  fill: `none`,
  stroke: `currentColor`,
  strokeWidth: 2,
  strokeLinecap: `round`,
  strokeLinejoin: `round`,
};
const Xb = (e) => {
  for (let t in e)
    if (t.startsWith(`aria-`) || t === `role` || t === `title`) return true;
  return false;
};
const Zb = React.forwardRef(
  (
    {
      color: e = `currentColor`,
      size: t = 24,
      strokeWidth: n = 2,
      absoluteStrokeWidth: i,
      className: a = ``,
      children: o,
      iconNode: s,
      ...c
    },
    l,
  ) =>
    React.createElement(
      `svg`,
      {
        ref: l,
        ...Yb,
        width: t,
        height: t,
        stroke: e,
        strokeWidth: i ? (Number(n) * 24) / Number(t) : n,
        className: Gb(`lucide`, a),
        ...(!o &&
          !Xb(c) && {
            "aria-hidden": `true`,
          }),
        ...c,
      },
      [
        ...s.map(([e, t]) => React.createElement(e, t)),
        ...(Array.isArray(o) ? o : [o]),
      ],
    ),
);
const createIcon = (e, t) => {
  let n = React.forwardRef(({ className: n, ...i }, a) =>
    React.createElement(Zb, {
      ref: a,
      iconNode: t,
      className: Gb(`lucide-${Kb(Jb(e))}`, `lucide-${e}`, n),
      ...i,
    }),
  );
  n.displayName = Jb(e);
  return n;
};
const ArrowUpRightIcon = createIcon(`arrow-up-right`, [
  [
    `path`,
    {
      d: `M7 7h10v10`,
      key: `1tivn9`,
    },
  ],
  [
    `path`,
    {
      d: `M7 17 17 7`,
      key: `1vkiza`,
    },
  ],
]);
const ChevronLeftIcon = createIcon(`chevron-left`, [
  [
    `path`,
    {
      d: `m15 18-6-6 6-6`,
      key: `1wnfg3`,
    },
  ],
]);
const ChevronRightIcon = createIcon(`chevron-right`, [
  [
    `path`,
    {
      d: `m9 18 6-6-6-6`,
      key: `mthhwq`,
    },
  ],
]);
const CodeIcon = createIcon(`code-xml`, [
  [
    `path`,
    {
      d: `m18 16 4-4-4-4`,
      key: `1inbqp`,
    },
  ],
  [
    `path`,
    {
      d: `m6 8-4 4 4 4`,
      key: `15zrgr`,
    },
  ],
  [
    `path`,
    {
      d: `m14.5 4-5 16`,
      key: `e7oirm`,
    },
  ],
]);
const ExternalLinkIcon = createIcon(`external-link`, [
  [
    `path`,
    {
      d: `M15 3h6v6`,
      key: `1q9fwt`,
    },
  ],
  [
    `path`,
    {
      d: `M10 14 21 3`,
      key: `gplh6r`,
    },
  ],
  [
    `path`,
    {
      d: `M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6`,
      key: `a6xqqp`,
    },
  ],
]);
const CloseIcon = createIcon(`x`, [
  [
    `path`,
    {
      d: `M18 6 6 18`,
      key: `1bl5f8`,
    },
  ],
  [
    `path`,
    {
      d: `m6 6 12 12`,
      key: `d8bk6v`,
    },
  ],
]);
export {
  ArrowUpRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CodeIcon,
  CloseIcon,
  ExternalLinkIcon,
};
