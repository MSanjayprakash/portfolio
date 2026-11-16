import { jsx, jsxs } from "../jsx-runtime.js";
import { React } from "../runtime.js";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { ArrowUpRightIcon } from "./Icons.js";

const certificates = [
  {
    id: "designboat",
    title: "UI/UX Design",
    issuer: "DesignBoat",
    image: "/assets/designboat-ui-ux-certificate.webp",
    description:
      "Completed a professional UI/UX Design course at DesignBoat, developing hands-on skills in user research, wireframing, prototyping, visual design, and creating intuitive digital experiences.",
  },
  {
    id: "coursera",
    title: "UI/UX Design",
    issuer: "Coursera",
    image: "/assets/coursera-ui-ux-certificate.webp",
    description:
      "Completed a professional UI/UX Design course on Coursera, developing hands-on skills in user research, wireframing, prototyping, visual design, and creating intuitive digital experiences.",
  },
];

const Pricing = () => {
  const sectionRef = React.useRef(null);

  useScrollReveal(sectionRef, ".certificate-heading, .certificate-card");

  return jsxs("section", {
    id: "services",
    ref: sectionRef,
    "aria-labelledby": "certificates-heading",
    className:
      "relative flex w-full scroll-mt-24 flex-col items-center overflow-hidden border-t border-white/5 px-5 py-16 text-gray-100 md:px-16 md:py-20 lg:px-24",
    children: [
      jsx("style", {
  children: `
    @media (max-width: 767px) {
      section#services[aria-labelledby="certificates-heading"] {
        padding-top: 32px;
        padding-bottom: 32px;
      }
    }
  `,
}),

      jsxs("header", {
        className:
          "certificate-heading relative z-10 mb-8 flex flex-col items-center text-center md:mb-12",
        children: [
          jsx("p", {
            className:
              "m-0 mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff6b7e] md:mb-3 md:text-xs",
            children: "Professional Training",
          }),
          jsx("h2", {
            id: "certificates-heading",
            className:
              "m-0 text-3xl font-black uppercase leading-tight tracking-tight text-white md:text-5xl",
            children: "Certificates",
          }),
          jsx("div", {
            "aria-hidden": "true",
            className: "mt-4 h-1 w-12 rounded-full bg-[#a31515] md:mt-5",
          }),
        ],
      }),

      jsx("div", {
        className:
          "relative z-10 grid w-full max-w-5xl grid-cols-1 gap-5 md:grid-cols-2 md:gap-6",
        children: certificates.map((certificate) =>
          jsxs(
            "article",
            {
              className:
                "certificate-card glass glass-grid-card flex h-full min-w-0 flex-col rounded-3xl p-4 md:p-5",
              children: [
                jsx("img", {
                  src: certificate.image,
                  alt: `${certificate.issuer} UI/UX Design certificate`,
                  loading: "lazy",
                  decoding: "async",
                  className:
                    "block aspect-[4/3] w-full rounded-2xl bg-black/20 object-contain",
                }),
                jsxs("div", {
                  className: "flex flex-1 flex-col items-start gap-3 pt-5",
                  children: [
                    jsxs("div", {
                      children: [
                        jsx("p", {
                          className:
                            "m-0 mb-1 text-xs font-bold uppercase tracking-widest text-[#ff6b7e]",
                          children: certificate.issuer,
                        }),
                        jsx("h3", {
                          className: "m-0 text-xl font-bold text-white",
                          children: certificate.title,
                        }),
                      ],
                    }),
                    jsx("p", {
                      className: "m-0 text-sm leading-relaxed text-gray-300",
                      children: certificate.description,
                    }),
                    jsx("div", {
                      className: "mt-auto pt-2",
                      children: jsxs("a", {
                        href: certificate.image,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        "aria-label": `View ${certificate.issuer} certificate (opens in a new tab)`,
                        className:
                          "glass-chip inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a31515] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
                        children: [
                          "View certificate",
                          jsx(ArrowUpRightIcon, {
                            "aria-hidden": "true",
                            className: "h-4 w-4",
                            strokeWidth: 2,
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              ],
            },
            certificate.id,
          ),
        ),
      }),
    ],
  });
};

export { Pricing };