import { jsx, jsxs } from "../jsx-runtime.js";
import { React } from "../runtime.js";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { ToolIcon } from "./ToolIcon.js";

const skillGroups = [
  {
    id: "ui-ux",
    title: "UI/UX Design",
    description:
      "I design intuitive digital experiences by understanding user needs, mapping journeys, and turning complex problems into simple, usable interfaces.",
    skills: [
      "UX Research & Usability Testing",
      "Wireframing & User Flows",
      "UI Design & Prototyping",
    ],
  },
  {
    id: "visual-design",
    title: "Visual & Graphic Design",
    description:
      "With a background in graphic design, I create visual identities and communication assets that balance creativity, clarity, and brand consistency.",
    skills: [
      "Branding & Visual Design",
      "Typography & Layout",
      "Posters & Social Media Design",
    ],
  },
];

const tools = [
  { label: "Figma", icon: "figma" },
  { label: "Framer", icon: "framer" },
  { label: "Adobe Photoshop", icon: "photoshop" },
  { label: "Adobe Illustrator", icon: "illustrator" },
  { label: "Adobe After Effects", icon: "aftereffects" },
  { label: "Adobe Premiere Pro", icon: "premiere" },
];

const skillsStyles = `
  #skills.portfolio-skills {
    --skills-line: rgba(255, 255, 255, 0.28);
    --skills-font: "Barlow Condensed", "Arial Narrow", sans-serif;
    box-sizing: border-box;
    width: 100%;
    padding: 72px 24px;
    background: #050505;
    color: #fff;
    scroll-margin-top: 96px;
  }

  #skills .skills-inner {
    max-width: 1120px;
    margin-inline: auto;
  }

  #skills .skills-title,
  #skills .skills-group-title,
  #skills .skills-tools-title {
    margin: 0;
    font-family: var(--skills-font);
    font-weight: 800;
    line-height: 1.05;
    text-transform: uppercase;
  }

  #skills .skills-title {
    margin-bottom: 56px;
    font-size: clamp(32px, 8.5vw, 112px);
    letter-spacing: -0.03em;
    text-align: center;
  }

  @supports (-webkit-text-stroke: 1px white) {
    #skills .skills-title {
      color: transparent;
      -webkit-text-stroke: 1px rgba(255, 255, 255, 0.78);
    }
  }

  #skills .skills-group {
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
    gap: 24px;
    padding: 24px 0 48px;
    border-top: 1px solid var(--skills-line);
  }

  #skills .skills-group-number {
    color: #999;
    font-family: var(--skills-font);
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
  }

  #skills .skills-group-title {
    font-size: clamp(26px, 3.5vw, 42px);
  }

  #skills .skills-description {
    max-width: 45ch;
    margin: 14px 0 12px;
    color: #d1d1d1;
    font-size: 15px;
    line-height: 1.55;
  }

  #skills .skills-list,
  #skills .skills-tool-grid {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  #skills .skills-list li {
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr);
    align-items: baseline;
    gap: 12px;
    padding-block: 14px;
    border-bottom: 1px solid var(--skills-line);
    font-family: var(--skills-font);
    font-size: clamp(16px, 2vw, 23px);
    font-weight: 700;
    line-height: 1.2;
    text-transform: uppercase;
  }

  #skills .skills-item-number {
    color: #999;
    font-size: 14px;
  }

  #skills .skills-tools {
    padding-top: 56px;
    border-top: 1px solid var(--skills-line);
    text-align: center;
  }

  #skills .skills-tools-title {
    margin-bottom: 40px;
    font-size: clamp(32px, 5.5vw, 64px);
  }

  #skills .skills-tool-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 40px 16px;
  }

  #skills .skills-tool {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  #skills .skills-tool-icon {
    display: grid;
    width: clamp(52px, 11vw, 100px);
    aspect-ratio: 1;
    place-items: center;
    border-radius: 20%;
    background: #252525;
    filter: grayscale(1);
    transition: filter 180ms ease, background-color 180ms ease;
  }

  #skills .skills-tool:hover .skills-tool-icon {
    background: #303030;
    filter: grayscale(0);
  }

  #skills .skills-tool-label {
    color: #d1d1d1;
    font-size: 13px;
    line-height: 1.3;
  }

  @media (max-width: 767px) {
    #skills.portfolio-skills {
      padding: 40px 20px;
    }

    #skills .skills-title {
      margin-bottom: 32px;
    }

    #skills .skills-group {
      grid-template-columns: minmax(0, 1fr);
      gap: 14px;
      padding: 20px 0 28px;
    }

    #skills .skills-tools {
      padding-top: 32px;
    }

    #skills .skills-tools-title {
      margin-bottom: 24px;
    }

    #skills .skills-tool-grid {
      gap: 24px 8px;
    }

    #skills .skills-tool-label {
      font-size: 11px;
    }
  }
`;

const Skills = () => {
  const sectionRef = React.useRef(null);

  useScrollReveal(sectionRef, "h2, .skills-group, .skills-tools");

  return jsxs("section", {
    id: "skills",
    ref: sectionRef,
    className: "portfolio-skills",
    "aria-labelledby": "skills-title",
    children: [
      jsx("style", { children: skillsStyles }),
      jsxs("div", {
        className: "skills-inner",
        children: [
          jsx("h2", {
            id: "skills-title",
            className: "skills-title",
            children: "Skills & Tools",
          }),
          skillGroups.map((group, groupIndex) =>
            jsxs(
              "div",
              {
                className: "skills-group",
                children: [
                  jsx("span", {
                    className: "skills-group-number",
                    "aria-hidden": "true",
                    children: `[${String(groupIndex + 1).padStart(2, "0")}]`,
                  }),
                  jsxs("div", {
                    children: [
                      jsx("h3", {
                        className: "skills-group-title",
                        children: group.title,
                      }),
                      jsx("p", {
                        className: "skills-description",
                        children: group.description,
                      }),
                      jsx("ul", {
                        className: "skills-list",
                        children: group.skills.map((skill, skillIndex) =>
                          jsxs(
                            "li",
                            {
                              children: [
                                jsx("span", {
                                  className: "skills-item-number",
                                  "aria-hidden": "true",
                                  children: String(skillIndex + 1).padStart(2, "0"),
                                }),
                                jsx("span", { children: skill }),
                              ],
                            },
                            skill
                          )
                        ),
                      }),
                    ],
                  }),
                ],
              },
              group.id
            )
          ),
          jsxs("div", {
            className: "skills-tools",
            children: [
              jsx("h3", {
                className: "skills-tools-title",
                children: "Tools I Use",
              }),
              jsx("ul", {
                className: "skills-tool-grid",
                children: tools.map((tool) =>
                  jsxs(
                    "li",
                    {
                      className: "skills-tool",
                      children: [
                        jsx("span", {
                          className: "skills-tool-icon",
                          "aria-hidden": "true",
                          children: jsx(ToolIcon, {
                            name: tool.icon,
                            size: "w-8 h-8 md:w-14 md:h-14",
                          }),
                        }),
                        jsx("span", {
                          className: "skills-tool-label",
                          children: tool.label,
                        }),
                      ],
                    },
                    tool.icon
                  )
                ),
              }),
            ],
          }),
        ],
      }),
    ],
  });
};

export { Skills };