"use client";

import { useLayoutEffect, useRef, useState } from "react";
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
// One gradient spans the whole row; each bar is a window onto it, clipped to an
// icon shape via mask-image so only the icon's opaque pixels reveal colour.

const HERO_GRADIENT =
  "linear-gradient(to top, rgb(239,98,159), rgb(238,205,163))";

// Icon + caption per bar. Icons are transparent PNGs — the alpha channel is the
// mask. Swap these paths for URLs returned by an image-upload API via setBarIcon().
const HERO_PANELS: { icon: string; title: string }[] = [
  { icon: "/icons/snakes-and-ladders.png", title: "snakes and ladders cli" },
  { icon: "/icons/fpl-notifications.png", title: "fpl notifications" },
  { icon: "/icons/jiramon.png", title: "jiramon" },
];

// ─── HeroPanel ───────────────────────────────────────────────────────────────

function HeroPanel({
  index,
  config,
  sharedImage,
  rowWidth,
  offset,
  icon,
  title,
}: {
  index: 0 | 1 | 2;
  config?: PanelConfig;
  sharedImage?: string;
  rowWidth: number;
  offset: number;
  icon: string;
  title: string;
}) {
  if (config?.image) {
    return (
      <div className="relative w-full h-full overflow-hidden">
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
        className="w-full h-full overflow-hidden"
        style={{
          backgroundImage: `url(${sharedImage})`,
          backgroundSize: "300% 100%",
          backgroundPosition: `${positions[index]} center`,
        }}
      />
    );
  }

  return (
    // font-size lives here so the icon layer and the label resolve the same
    // "1em" for --label-lh below — that's what keeps the two-line reservation
    // and the icon crop point in sync from a single value.
    <div
      className="relative w-full h-full overflow-hidden text-xl md:text-5xl font-bold"
      style={{ "--label-lh": 1.15 } as React.CSSProperties}
    >
      {/* Gradient window: sized to the full row and shifted left by this bar's
          offset within it, so all three windows read as one continuous gradient.
          Height stops at the bottom edge of the label's first line: the space
          above the label (iconZoneHeight = 100% - 2 * --label-lh) plus the one
          line the icon still shows behind, i.e. 100% - 1 * --label-lh. */}
      <div
        className="absolute top-0 left-0 right-0"
        style={
          {
            backgroundImage: HERO_GRADIENT,
            backgroundSize: `${rowWidth}px 100%`,
            "--bg-offset": `-${offset}px`,
            backgroundPosition: "var(--bg-offset) center",
            "--icon": `url("${icon}")`,
            WebkitMaskImage: "var(--icon)",
            maskImage: "var(--icon)",
            // Sized past the bar's own width (aspect ratio preserved via
            // "auto" height) and nudged right by a flat pixel offset so the
            // icon overflows and gets cropped by the bar's overflow-hidden,
            // matching the reference bleed-and-crop look.
            WebkitMaskSize: "130% auto",
            maskSize: "130% auto",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "calc(50% + 40px) center",
            maskPosition: "calc(50% + 40px) center",
            height: "calc(100% - var(--label-lh) * 1em)",
          } as React.CSSProperties
        }
      />
      {/* Label: pinned flush to the tile's bottom edge (no vertical padding)
          so the 2-line reservation below lines up exactly with the icon-layer
          crop above. min-height floors it at 2 lines even for short titles;
          line-clamp caps it at 2 for long ones — always exactly 2, never 1 or 3. */}
      <div
        className="absolute bottom-0 left-4 right-4 md:left-6 md:right-6"
        style={
          {
            lineHeight: "var(--label-lh)",
            minHeight: "calc(var(--label-lh) * 2em)",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
          } as React.CSSProperties
        }
      >
        {title}
      </div>
    </div>
  );
}

// ─── HeroRow ─────────────────────────────────────────────────────────────────
// Owns the row's measured width and each bar's offset within it so the shared
// gradient background lines up continuously across all three bars, and re-measures
// on resize so the illusion holds at any width.

function HeroRow({ extraOffset }: { extraOffset: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [rowWidth, setRowWidth] = useState(0);
  const [offsets, setOffsets] = useState<number[]>([0, 0, 0]);
  const [iconUrls, setIconUrls] = useState<[string, string, string]>([
    "",
    "",
    "",
  ]);

  // Single entry point for setting a bar's icon — local paths now and
  // image-upload API results later both flow through this the same way.
  function setBarIcon(barIndex: 0 | 1 | 2, url: string) {
    setIconUrls((prev) => {
      const next = [...prev] as [string, string, string];
      next[barIndex] = url;
      return next;
    });
  }

  useLayoutEffect(() => {
    HERO_PANELS.forEach((panel, i) => setBarIcon(i as 0 | 1 | 2, panel.icon));
  }, []);

  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    function measure() {
      const rowRect = row!.getBoundingClientRect();
      setRowWidth(rowRect.width);
      setOffsets(
        barRefs.current.map((bar) =>
          bar ? bar.getBoundingClientRect().left - rowRect.left : 0
        )
      );
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className="flex gap-1.5 bg-background w-full"
      style={{ height: `calc(100dvh - 9rem - ${extraOffset}px)` }}
    >
      {([0, 1, 2] as const).map((i) => (
        <div
          key={i}
          ref={(el) => {
            barRefs.current[i] = el;
          }}
          className="flex-1 overflow-hidden"
        >
          <HeroPanel
            index={i}
            config={heroConfig.panels?.[i]}
            sharedImage={heroConfig.sharedImage}
            rowWidth={rowWidth}
            offset={offsets[i] ?? 0}
            icon={iconUrls[i]}
            title={HERO_PANELS[i].title}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleSpace, setTitleSpace] = useState(0);

  function handleToggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  // Measure the title's own height + margin-bottom so the hero row below it
  // can still fill exactly the remaining viewport height, the way it did
  // when the title lived below the hero instead of above it.
  useLayoutEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    function measure() {
      const rect = title!.getBoundingClientRect();
      const marginBottom = parseFloat(getComputedStyle(title!).marginBottom || "0");
      setTitleSpace(rect.height + marginBottom);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(title);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 pt-6 pb-10 md:pb-16">

      {/* ── Title ── */}
      <h1 ref={titleRef} className="text-5xl md:text-7xl font-bold mb-10 md:mb-14">
        Project Portfolio
      </h1>

      {/* ── Hero: 3-panel split image ── */}
      {/* px-6/px-12 insets the panels from the project-list edges */}
      <div className="px-6 md:px-12 mb-12 md:mb-16">
        {/* navbar(~6rem) + equal gap above(1.5rem) + equal gap below(1.5rem) = 9rem, */}
        {/* plus titleSpace since the title now sits above the hero row */}
        <HeroRow extraOffset={titleSpace} />
      </div>

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
