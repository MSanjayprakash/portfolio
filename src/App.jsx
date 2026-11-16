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
  return (
    <div className="relative isolate min-h-screen text-gray-100 flex flex-col font-sans selection:bg-[#a31515] selection:text-white bg-[#07070a]">
      <WebGLBackground />
      <div className="ambient" aria-hidden="true">
        <i className="o1" />
        <i className="o3" />
      </div>
      <ParticleBackground />
      {isLoading && (
        <IntroLoader
          onComplete={() => {
            setIsLoading(false);
            setTimeout(() => {
              ScrollTrigger.refresh();
            }, 100);
          }}
        />
      )}
      <Navigation />
      <main className="relative z-10 w-full flex-1">
        <Hero />
        <ClientResults />
        <FeaturedWork
          onSelectProject={(project) => {
            setSelectedProject(project);
            setIsModalOpen(true);
          }}
        />
        <About />
        <Pricing />
        <Skills />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <ProjectModal
        project={isModalOpen ? selectedProject : null}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onNavigate={(direction) => {
          if (!selectedProject) return;
          const currentIndex = projects.findIndex(
            ({ id }) => id === selectedProject.id,
          );
          if (currentIndex === -1) return;
          const nextIndex =
            (currentIndex + direction + projects.length) % projects.length;
          setSelectedProject(projects[nextIndex]);
        }}
        onInquire={() => {
          setIsModalOpen(false);
          document.getElementById(`contact`)?.scrollIntoView({
            behavior: `smooth`,
          });
        }}
      />
    </div>
  );
}
export { App };
export default App;
