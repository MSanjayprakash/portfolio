import { jsx, jsxs } from "../jsx-runtime.js";
import { React } from "../runtime.js";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
const Footer = () => {
  let footerRef = React.useRef(null);
  useScrollReveal(footerRef, `footer > div > *`);
  return /* @__PURE__ */ jsx(
    "footer",
    {
      ref: footerRef,
      className: "glass-bar w-full text-white py-12 px-5 md:px-16",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/",
            className: "text-xl font-black tracking-tight uppercase flex items-center",
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-red-600", children: `V` }),
              /* @__PURE__ */ jsx("span", { children: `AIDEESHWARAN.` })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 font-bold uppercase tracking-widest text-center", children: [
          `\xA9 `,
          currentYear,
          ` VAIDEESHWARAN. UI/UX Designer.`
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 text-xs text-gray-400 uppercase tracking-widest font-bold", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#hero",
              className: "hover:text-red-500 transition-colors",
              children: `Top`
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#about",
              className: "hover:text-red-500 transition-colors",
              children: `About`
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#projects",
              className: "hover:text-red-500 transition-colors",
              children: `Projects`
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#contact",
              className: "hover:text-red-500 transition-colors",
              children: `Contact`
            }
          )
        ] })
      ] })
    }
  );
};
export {
  Footer
};
