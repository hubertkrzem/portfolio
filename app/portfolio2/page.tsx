"use client";

import { useState } from "react";
import Image from "next/image";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Project {
  title: string;
  date: string; // MM.YY
  description: string;
  technologies?: string[];
  link?: string;
}

interface PanelConfig {
  image?: string;
}

// To display a single image spanning all three panels, set sharedImage.
// To use a different image per panel, set panels[n].image.
// Leave both unset to use the default peach/sunset gradient.
interface HeroConfig {
  sharedImage?: string;
  panels?: [PanelConfig, PanelConfig, PanelConfig];
}

// ─── Content ─────────────────────────────────────────────────────────────────

const heroConfig: HeroConfig = {};

const projects: Project[] = [
  {
    title: "Portfolio Website",
    date: "07.26",
    description:
      "Personal portfolio built with Next.js 16 and Tailwind CSS v4. Features a custom animated SVG blob component, a sticky navbar with scroll-driven shrinking, and a smooth responsive layout.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    link: "https://github.com/hubertkrzem",
  },
  {
    title: "Snakes and Ladders CLI",
    date: "05.26",
    description:
      "A second project — replace this with the real name and description. Describe the problem it solves, the stack you used, and anything interesting you learned or built.",
    technologies: ["Python"],
  },
  {
    title: "Project Three",
    date: "11.24",
    description:
      "A third project — replace this with the real name and description. Include scope, technical decisions, and measurable outcomes where possible.",
    technologies: ["Python", "FastAPI", "Docker"],
  },
];

// ─── Continuous gradient shared across all default panels ────────────────────
// Exactly the two blob colours; each panel reveals a different third via backgroundPosition.

const HERO_GRADIENT =
  "linear-gradient(to right, rgb(239,98,159), rgb(238,205,163))";

const PANEL_BG_POSITIONS = ["0% 50%", "50% 50%", "100% 50%"] as const;

// ─── HeroPanel ───────────────────────────────────────────────────────────────

function HeroPanel({
  index,
  config,
  sharedImage,
}: {
  index: 0 | 1 | 2;
  config?: PanelConfig;
  sharedImage?: string;
}) {
  if (config?.image) {
    return (
      <div className="flex-1 relative overflow-hidden">
        <Image
          src={config.image}
          alt={`Portfolio hero panel ${index + 1}`}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  if (sharedImage) {
    const positions = ["0%", "50%", "100%"] as const;
    return (
      <div
        className="flex-1 overflow-hidden"
        style={{
          backgroundImage: `url(${sharedImage})`,
          backgroundSize: "300% 100%",
          backgroundPosition: `${positions[index]} center`,
        }}
      />
    );
  }

  return (
    <div
      className="flex-1"
      style={{
        backgroundImage: HERO_GRADIENT,
        backgroundSize: "300% 100%",
        backgroundPosition: PANEL_BG_POSITIONS[index],
      }}
    />
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function handleToggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 pt-6 pb-10 md:pb-16">
      {/* ── Title ── */}
      <h1 className="text-5xl md:text-7xl font-bold mb-0 md:mb-0">
        Project Portfolio
      </h1>
      <div className="h-0.75 my-4 bg-linear-to-r from-[rgb(239,98,159)] to-[rgb(238,205,163)]" />

      {/* ── Projects list ── */}
      <div className="w-full">
        {projects.map((project, index) => (
          <div key={index} className="border-t border-black">

            {/* Row: title left, date right */}
            <button
              onClick={() => handleToggle(index)}
              className="flex w-full justify-between items-baseline py-4 md:py-5 text-left cursor-pointer group"
            >
              <span className="text-base md:text-lg font-bold">{project.title}</span>
              <span className="text-base md:text-lg font-bold tabular-nums">{project.date}</span>
            </button>

            {/* Accordion body — grid-rows trick gives true height animation */}
            <div
              style={{
                display: "grid",
                gridTemplateRows: openIndex === index ? "1fr" : "0fr",
                transition: "grid-template-rows 600ms cubic-bezier(0.65, 0, 0.35, 1)",
              }}
            >
              <div className="overflow-hidden">
                <div className="pb-8 pt-1">
                  <p className="text-sm md:text-base leading-relaxed mb-5">
                    {project.description}
                  </p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-bold border border-black px-2 py-0.5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.link && (
                    <a
                      href={project.link}
                      className="text-sm font-bold underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View project →
                    </a>
                  )}
                </div>
              </div>
            </div>

          </div>
        ))}

        {/* Closing border */}
        <div className="border-t border-black" />
      </div>

      {/* ── GitHub footer link ── */}
      <div className="mt-8">
        <a
          href="https://github.com/hubertkrzem"
          className="text-sm font-bold underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View other projects on GitHub →
        </a>
      </div>

    </div>
  );
}
