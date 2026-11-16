import { React } from "../runtime.js";

const ProjectModal = ({ project, onClose }) => {
  React.useEffect(() => {
    if (!project) return;

    const url = project.projectUrl?.trim();

    onClose?.();

    if (url) {
      window.location.assign(url);
    }
  }, [project, onClose]);

  return null;
};

export { ProjectModal };