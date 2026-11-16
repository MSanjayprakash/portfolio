import { Cx, pC, mC } from "../vendor/portfolio-libraries.js";
import { React, jsxRuntime } from "../runtime.js";
const Button = React.forwardRef(
  ({ className: e, variant: t, size: n, asChild: r = false, ...a }, o) =>
    (0, jsxRuntime.jsx)(r ? Cx : `button`, {
      className: pC(
        mC({
          variant: t,
          size: n,
          className: e,
        }),
      ),
      ref: o,
      ...a,
    }),
);
Button.displayName = `Button`;
export { Button };
