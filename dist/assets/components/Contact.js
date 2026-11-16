import { jsx, jsxs } from "../jsx-runtime.js";
import { React } from "../runtime.js";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { ScrambledText } from "../vendor/portfolio-libraries.js";
import { profile } from "../data/portfolio.js";

const EMAILJS_CONFIG = {
  service_id: "YOUR_SERVICE_ID",
  template_id: "YOUR_TEMPLATE_ID",
  user_id: "YOUR_PUBLIC_KEY",
};

const Contact = () => {
  const sectionRef = React.useRef(null);
  const headingRef = React.useRef(null);
  const formPanelRef = React.useRef(null);
  const sendingRef = React.useRef(false);
  const successTimerRef = React.useRef(null);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [formError, setFormError] = React.useState("");

  useScrollReveal(sectionRef, "h2, .glass-panel-card, .whatsapp-card");

  React.useEffect(() => {
    return () => clearTimeout(successTimerRef.current);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (sendingRef.current) return;

    const form = event.currentTarget;
    const fields = new FormData(form);

    const templateParams = {
      from_name: String(fields.get("from_name") || "").trim(),
      reply_to: String(fields.get("reply_to") || "").trim(),
      message: String(fields.get("message") || "").trim(),
    };

    if (!templateParams.from_name || !templateParams.message) {
      setFormError("Please enter your name and a message.");
      return;
    }

    if (
      Object.values(EMAILJS_CONFIG).some(
        (value) => !value.trim() || value.startsWith("YOUR_")
      )
    ) {
      setFormError("The contact form is unavailable. Please use WhatsApp.");
      return;
    }

    sendingRef.current = true;
    setFormError("");

    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...EMAILJS_CONFIG,
          template_params: templateParams,
        }),
      });

      if (!response.ok) {
        throw new Error(`EmailJS ${response.status}: ${await response.text()}`);
      }

      setIsSubmitted(true);
      successTimerRef.current = setTimeout(() => setIsSubmitted(false), 4000);
    } catch (error) {
      console.error("EmailJS submission failed:", error);
      setFormError("Couldn’t send your message. Please try again or use WhatsApp.");
    } finally {
      sendingRef.current = false;
    }
  }

  return jsxs("section", {
    id: "contact",
    ref: sectionRef,
    className:
      "relative w-full text-gray-100 py-28 px-5 md:px-16 lg:px-24 flex flex-col items-center justify-center overflow-hidden border-t border-white/5",
    children: [
      jsxs("div", {
        ref: headingRef,
        className: "flex flex-col items-center text-center mb-14 z-10",
        children: [
          jsxs("span", {
            className:
              "text-[#a31515] font-bold uppercase text-sm md:text-base tracking-[0.2em] mb-2 flex items-center gap-1.5",
            children: [
              jsx("img", {
                src: "/assets/spydy-DLbFrGCQ.png",
                alt: "Spider",
                className: "w-6 h-6 object-contain",
              }),
              "Get In Touch",
            ],
          }),
          jsx("h2", {
            className:
              "text-5xl md:text-7xl font-black tracking-tight uppercase text-white",
            children: "CONTACT.",
          }),
          jsx("div", {
            className: "w-20 h-1.5 bg-[#a31515] mt-3 rounded-full",
          }),
        ],
      }),

      jsxs("div", {
        className: "relative w-full max-w-4xl z-10",
        children: [
          jsxs("a", {
            href: profile.whatsapp.url,
            target: "_blank",
            rel: "noopener noreferrer",
            "aria-label": "Chat with Vaideeshwaran on WhatsApp",
            className:
              "whatsapp-card glass glass-hover mb-8 flex items-center gap-4 rounded-3xl px-6 py-5 md:px-8 relative z-10",
            children: [
              jsx("span", {
                className:
                  "whatsapp-icon grid h-12 w-12 shrink-0 place-items-center rounded-2xl",
                children: jsx("svg", {
                  viewBox: "0 0 24 24",
                  className: "h-6 w-6",
                  fill: "currentColor",
                  "aria-hidden": "true",
                  children: jsx("path", {
                    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
                  }),
                }),
              }),
              jsxs("span", {
                className: "flex min-w-0 flex-col",
                children: [
                  jsx("span", {
                    className:
                      "text-xs font-bold uppercase tracking-[0.2em] text-gray-400",
                    children: "WhatsApp",
                  }),
                  jsx("span", {
                    className:
                      "text-base sm:text-lg md:text-xl font-extrabold text-gray-100",
                    children: profile.whatsapp.number,
                  }),
                ],
              }),
              jsx("span", {
                className:
                  "whatsapp-cta ml-auto hidden shrink-0 text-xs font-bold uppercase tracking-wider sm:block",
                children: "Chat now →",
              }),
            ],
          }),

          jsx("div", {
            className: "red-halo",
            style: { inset: "-14% -10%" },
            "aria-hidden": "true",
          }),

          jsx("div", {
            ref: formPanelRef,
            className:
              "glass glass-panel-card w-full p-8 md:p-14 rounded-3xl relative z-10",
            children: isSubmitted
              ? jsxs("div", {
                  role: "status",
                  className: "py-12 flex flex-col items-center text-center",
                  children: [
                    jsx("div", {
                      className:
                        "glass-red w-16 h-16 text-white rounded-full flex items-center justify-center text-3xl font-black mb-4 animate-bounce",
                      children: "✓",
                    }),
                    jsx("h3", {
                      className:
                        "text-3xl font-black uppercase tracking-tight text-white mb-3",
                      children: "Message Sent!",
                    }),
                    jsx("p", {
                      className: "text-lg text-gray-400 font-medium",
                      children:
                        "Thanks for reaching out to Vaideeshwaran. I'll get back to you shortly.",
                    }),
                  ],
                })
              : jsxs("form", {
                  onSubmit: handleSubmit,
                  className: "flex flex-col gap-7",
                  children: [
                    jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
                      children: [
                        jsxs("div", {
                          className: "flex flex-col gap-2.5",
                          children: [
                            jsx("label", {
                              htmlFor: "contact-name",
                              className:
                                "text-sm md:text-base font-bold uppercase tracking-wider text-gray-400",
                              children: "Your Name",
                            }),
                            jsx("input", {
                              id: "contact-name",
                              name: "from_name",
                              required: true,
                              type: "text",
                              placeholder: "Your Name",
                              className:
                                "w-full px-6 py-5 glass-input rounded-3xl text-lg md:text-xl font-medium text-gray-100 placeholder:text-gray-500 focus:outline-none transition-all",
                            }),
                          ],
                        }),
                        jsxs("div", {
                          className: "flex flex-col gap-2.5",
                          children: [
                            jsx("label", {
                              htmlFor: "contact-email",
                              className:
                                "text-sm md:text-base font-bold uppercase tracking-wider text-gray-400",
                              children: "Your Email",
                            }),
                            jsx("input", {
                              id: "contact-email",
                              name: "reply_to",
                              required: true,
                              type: "email",
                              placeholder: "your.email@example.com",
                              className:
                                "w-full px-6 py-5 glass-input rounded-3xl text-lg md:text-xl font-medium text-gray-100 placeholder:text-gray-500 focus:outline-none transition-all",
                            }),
                          ],
                        }),
                      ],
                    }),
                    jsxs("div", {
                      className: "flex flex-col gap-2.5",
                      children: [
                        jsx("label", {
                          htmlFor: "contact-message",
                          className:
                            "text-sm md:text-base font-bold uppercase tracking-wider text-gray-400",
                          children: "Message & Project Scope",
                        }),
                        jsx("textarea", {
                          id: "contact-message",
                          name: "message",
                          required: true,
                          rows: 6,
                          placeholder: "Let's build something cinematic together...",
                          className:
                            "w-full px-6 py-5 glass-input rounded-3xl text-lg md:text-xl font-medium text-gray-100 placeholder:text-gray-500 focus:outline-none transition-all resize-none",
                        }),
                      ],
                    }),
                    jsx(ScrambledText, {
                      type: "submit",
                      variant: "primary",
                      className: "self-center mt-2",
                      children: "Send Message",
                    }),
                    formError &&
                      jsx("p", {
                        role: "alert",
                        className: "text-center text-sm text-red-300",
                        children: formError,
                      }),
                  ],
                }),
          }),
        ],
      }),
    ],
  });
};

export { Contact };