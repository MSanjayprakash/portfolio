import { React } from "../runtime.js";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
const currentYear = new Date().getFullYear();
const Footer = () => {
  let footerRef = React.useRef(null);
  useScrollReveal(footerRef, `footer > div > *`);
  return (
    <footer
      ref={footerRef}
      className="glass-bar w-full text-white py-12 px-5 md:px-16"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <a
          href="/"
          className="text-xl font-black tracking-tight uppercase flex items-center"
        >
          <span className="text-red-600">{`V`}</span>
          <span>{`AIDEESHWARAN.`}</span>
        </a>
        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest text-center">
          {`© `}
          {currentYear}
          {` VAIDEESHWARAN. UI/UX Designer.`}
        </div>
        <div className="flex items-center gap-6 text-xs text-gray-400 uppercase tracking-widest font-bold">
          <a
            href="#hero"
            className="hover:text-red-500 transition-colors"
          >{`Top`}</a>
          <a
            href="#about"
            className="hover:text-red-500 transition-colors"
          >{`About`}</a>
          <a
            href="#projects"
            className="hover:text-red-500 transition-colors"
          >{`Projects`}</a>
          <a
            href="#contact"
            className="hover:text-red-500 transition-colors"
          >{`Contact`}</a>
        </div>
      </div>
    </footer>
  );
};
export { Footer };
