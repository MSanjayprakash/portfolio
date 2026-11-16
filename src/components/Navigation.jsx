import { jsx, jsxs } from "../jsx-runtime.js";
import { React } from "../runtime.js";
const Navigation = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  React.useEffect(() => {
    function updateScrollState() {
      setIsScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", updateScrollState);
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);
  return /* @__PURE__ */ jsx("nav", { className: "fixed top-0 left-0 w-full z-50 px-3 md:px-6 pt-3", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `glass max-w-7xl mx-auto rounded-2xl px-5 md:px-8 flex items-center justify-between transition-all duration-300 ${isScrolled ? `py-2.5 !bg-[#111113]/80` : `py-3.5`}`,
      children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/",
            className: "text-white text-2xl font-black tracking-tight uppercase group flex items-center",
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]", children: `V` }),
              /* @__PURE__ */ jsx("span", { className: "group-hover:text-red-500 transition-colors duration-300", children: `AIDEESHWARAN.` })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center gap-8", children: [`Projects`, `About`, `Certificate`, `Skills`, `Contact`].map((e) => /* @__PURE__ */ jsxs(
          "a",
          {
            href: e === "Certificate" ? "#services" : `#${e.toLowerCase()}`,
            className: "relative text-xs md:text-sm font-bold text-gray-400 uppercase tracking-[0.15em] transition-colors duration-300 hover:text-white group",
            children: [
              e,
              /* @__PURE__ */ jsx("span", { className: "absolute -bottom-2 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 ease-out group-hover:w-full shadow-[0_0_8px_rgba(220,38,38,0.8)]" })
            ]
          },
          e
        )) }),
        /* @__PURE__ */ jsx("div", { className: "hidden sm:block", children: /* @__PURE__ */ jsx(
          "a",
          {
            href: "#contact",
            className: "glass-red inline-block px-5 py-2 rounded-full text-white text-xs font-bold uppercase tracking-wider",
            children: `Let's Talk`
          }
        ) })
      ]
    }
  ) });
};
export {
  Navigation
};
