import { jsx, jsxs } from "./jsx-runtime.js";
import { React } from "./runtime.js";
import { Navigation } from "./components/Navigation.js";
import { Hero } from "./components/Hero.js";
import { projects } from "./data/portfolio.js";
import { ClientResults } from "./components/ClientResults.js";
import { About } from "./components/About.js";
import { Skills } from "./components/Skills.js";
import { FeaturedWork } from "./components/FeaturedWork.js";
import { Pricing } from "./components/Pricing.js";
import { Contact } from "./components/Contact.js";
import { Footer } from "./components/Footer.js";
import { ProjectModal } from "./components/ProjectModal.js";
import { IntroLoader } from "./components/IntroLoader.js";
import { ParticleBackground } from "./effects/ParticleBackground.js";
import { WebGLBackground } from "./effects/WebGLBackground.js";
import { ScrollTrigger } from "./vendor/portfolio-libraries.js";
function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "relative isolate min-h-screen text-gray-100 flex flex-col font-sans selection:bg-[#a31515] selection:text-white bg-[#07070a]", children: [
    /* @__PURE__ */ jsx(WebGLBackground, {}),
    /* @__PURE__ */ jsxs("div", { className: "ambient", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("i", { className: "o1" }),
      /* @__PURE__ */ jsx("i", { className: "o3" })
    ] }),
    /* @__PURE__ */ jsx(ParticleBackground, {}),
    isLoading && /* @__PURE__ */ jsx(
      IntroLoader,
      {
        onComplete: () => {
          setIsLoading(false);
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 100);
        }
      }
    ),
    /* @__PURE__ */ jsx(Navigation, {}),
    /* @__PURE__ */ jsxs("main", { className: "relative z-10 w-full flex-1", children: [
      /* @__PURE__ */ jsx(Hero, {}),
      /* @__PURE__ */ jsx(ClientResults, {}),
      /* @__PURE__ */ jsx(
        FeaturedWork,
        {
          onSelectProject: (project) => {
            setSelectedProject(project);
            setIsModalOpen(true);
          }
        }
      ),
      /* @__PURE__ */ jsx(About, {}),
      /* @__PURE__ */ jsx(Pricing, {}),
      /* @__PURE__ */ jsx(Skills, {}),
      /* @__PURE__ */ jsx(Contact, {})
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx(Footer, {}) }),
    /* @__PURE__ */ jsx(
      ProjectModal,
      {
        project: isModalOpen ? selectedProject : null,
        onClose: () => {
          setIsModalOpen(false);
        },
        onNavigate: (direction) => {
          if (!selectedProject) return;
          const currentIndex = projects.findIndex(
            ({ id }) => id === selectedProject.id
          );
          if (currentIndex === -1) return;
          const nextIndex = (currentIndex + direction + projects.length) % projects.length;
          setSelectedProject(projects[nextIndex]);
        },
        onInquire: () => {
          setIsModalOpen(false);
          document.getElementById(`contact`)?.scrollIntoView({
            behavior: `smooth`
          });
        }
      }
    )
  ] });
}
var App_default = App;
export {
  App,
  App_default as default
};
