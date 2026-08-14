"use client";

import { useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Project {
  title: string;
  date: string; // MM.YY
  description: string;
  technologies?: string[];
  link?: string;
  // Optional so future projects can land without matching icon art ready —
  // a card just falls back to a plain gradient fill when it's missing.
  icon?: string;
}

// ─── Content ─────────────────────────────────────────────────────────────────

const projects: Project[] = [
  {
    title: "Portfolio Website",
    date: "07.26",
    description:
      "Personal portfolio built with Next.js 16 and Tailwind CSS v4. Features a custom animated SVG blob component, a sticky navbar with scroll-driven shrinking, and a smooth responsive layout.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    link: "https://github.com/hubertkrzem",
    icon: "/icons/1f4ab.svg", // placeholder — no dedicated icon yet
  },
  {
    title: "Snakes and Ladders CLI",
    date: "05.26",
    description:
      "A snakes and Ladders CLI written in Python that runs monte carlo simulations of snakes and ladders games. Includes customisable settings and returns key game metrics for analysis of how board changes affect game results.",
    technologies: ["Python"],
    icon: "icons/1f40d.svg",
  },
  {
    title: "Jiramon",
    date: "7.26",
    description:
      "Created a tool that takes in webhooks and automatically syncs boards between Jira and Monday. Built for the PM team I was placed on during my IBM to reduce paperwork and save time.",
    technologies: ["JavaScript", "Docker"],
    icon: "/icons/jiramon.png", // placeholder — no dedicated icon yet
  },
  {
    title: "FPL Notification tool",
    date: "08.25",
    description:
      "A fantasy football notification tool written in Python and Swift, accesses the public FPL API and outputs notifications to user phones.",
    technologies: ["Swift", "Python"],
    icon: "/icons/fpl-notifications.png", // placeholder — no dedicated icon yet
  }
];

// Card gradient fill — same brand pink→peach used for the title's underline.
const CARD_GRADIENT = "linear-gradient(to top, rgb(239,98,159), rgb(238,205,163))";

// Fixed height "buckets" a card can land on. Column width in this layout tops
// out around ~360–370px at every breakpoint (columns-2 on mobile, columns-3
// once max-w-6xl is reached), so these are all comfortably taller than that —
// width < height holds by construction, no runtime measuring needed.
const HEIGHT_BUCKETS = ["h-[28rem]", "h-[34rem]", "h-[40rem]"];

function randomHeights() {
  return projects.map(
    () => HEIGHT_BUCKETS[Math.floor(Math.random() * HEIGHT_BUCKETS.length)]
  );
}

const GLOW = "border-[rgb(239,98,159)] shadow-[0_0_10px_-4px_rgba(239,98,159,0.35)]";

// Gap between cards that become visible in the same scroll "batch" (see the
// IntersectionObserver callback below) — keeps a whole visible row from
// popping in all at once by staggering them left-to-right instead.
const CARD_STAGGER_MS = 110;

// Tailwind only detects classes that appear as complete, literal text in the
// source — concatenating a "hover:" prefix onto a shared string at runtime
// (e.g. `hover:${GLOW}`) produces a class name Tailwind never sees and
// therefore never generates CSS for. So each state variant needs its own
// fully-spelled-out literal string instead of being built dynamically.
// Border + a pink drop shadow beneath the card, both only on
// hover/focus/press — text color is untouched (see the title span below).
const CARD_BORDER_GLOW =
  "hover:border-[rgb(239,98,159)] hover:shadow-[0_12px_24px_-8px_rgba(239,98,159,0.45)] " +
  "focus-visible:border-[rgb(239,98,159)] focus-visible:shadow-[0_12px_24px_-8px_rgba(239,98,159,0.45)] " +
  "active:border-[rgb(239,98,159)] active:shadow-[0_12px_24px_-8px_rgba(239,98,159,0.45)]";

// ─── ProjectCard ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  heightClass,
  isOpen,
  onToggle,
  cardRef,
  revealed,
  revealDelayMs,
  reduceMotion,
}: {
  project: Project;
  heightClass: string;
  isOpen: boolean;
  onToggle: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
  revealed: boolean;
  revealDelayMs: number;
  reduceMotion: boolean;
}) {
  return (
    <div
      ref={cardRef}
      className={`relative w-full ${heightClass} break-inside-avoid mb-4 md:mb-6 ${
        reduceMotion ? "" : revealed ? "animate-fly-in-bottom" : "opacity-0"
      }`}
      style={!reduceMotion && revealed ? { animationDelay: `${revealDelayMs}ms` } : undefined}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        // font-size lives here so the icon layer and the label resolve the same
        // "1em" for --label-lh below — that's what keeps the two-line reservation
        // and the icon crop point in sync from a single value.
        className={`group relative block w-full h-full overflow-hidden text-left text-xl md:text-4xl font-bold border border-transparent motion-safe:transition-all motion-safe:duration-200 [--label-bottom:0.5rem] md:[--label-bottom:0.75rem] ${CARD_BORDER_GLOW} focus-visible:outline-none cursor-pointer`}
        style={
          {
            "--label-lh": 1.15,
            // The span below adds this as padding-bottom to keep descenders
            // from getting clipped, which pushes its rendered lines up by
            // the same amount — subtracted here too so the icon's crop line
            // stays sitting exactly on the line-1/line-2 boundary (the
            // midpoint between the bottom of the top line and the top of
            // the bottom line) instead of drifting down into line 2.
            "--label-descender-pad": "0.2em",
          } as React.CSSProperties
        }
      >
        {/* Icon window: bleeds past the card's left edge and gets cropped by
            the card's own overflow-hidden. Height stops at the top of the
            label's bottom line — see the label layer below. --label-bottom
            and --label-descender-pad (both applied to the label, below) are
            subtracted here too, so the icon's bottom edge stays aligned with
            the label's actual line-1/line-2 boundary. */}
        <div
          className="absolute top-0 left-0 right-0"
          style={
            {
              backgroundImage: CARD_GRADIENT,
              ...(project.icon
                ? {
                    "--icon": `url("${project.icon}")`,
                    WebkitMaskImage: "var(--icon)",
                    maskImage: "var(--icon)",
                    // Oversized (aspect ratio preserved via "auto" height) and
                    // nudged slightly right so the icon overflows and gets
                    // cropped, matching the reference bleed-and-crop look.
                    WebkitMaskSize: "130% auto",
                    maskSize: "130% auto",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "calc(50% + 20px) center",
                    maskPosition: "calc(50% + 20px) center",
                  }
                : {}),
              height:
                "calc(100% - var(--label-lh) * 1em - var(--label-bottom) - var(--label-descender-pad))",
            } as React.CSSProperties
          }
        />

        {/* Label: raised slightly off the card's bottom edge (rather than
            flush at bottom-0) so descenders like the tail of a "j" don't get
            clipped by the card's overflow-hidden. Reserves a 2-line-tall
            zone (min-height on this flex container); justify-end packs a
            1-line title onto the bottom line — clear of the icon bleed above
            — while a genuinely 2-line title already fills the whole zone, so
            this only changes the 1-line case. */}
        <div
          className="absolute left-2 right-4 md:left-3 md:right-6 flex flex-col justify-end"
          style={
            {
              bottom: "var(--label-bottom)",
              minHeight: "calc(var(--label-lh) * 2em)",
            } as React.CSSProperties
          }
        >
          <span
            className="break-words text-black"
            style={
              {
                lineHeight: "var(--label-lh)",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                // `overflow: hidden` here clips at a box computed strictly from
                // line-height, which doesn't reserve any room below the
                // baseline for descenders (g/j/y/p/q) — this padding gives
                // them somewhere to render without pushing the clamp's
                // line-count math off (it's a fraction of the font's own
                // em-box, so it scales with the icon/text at both
                // breakpoints).
                paddingBottom: "var(--label-descender-pad)",
              } as React.CSSProperties
            }
          >
            {project.title}
          </span>
        </div>
      </button>

      {/* Overlay: a sibling of the button (not nested inside it) so the real
          <a> link below stays valid HTML instead of a link-inside-a-button. */}
      {isOpen && (
        <div
          onClick={onToggle}
          className={`absolute inset-0 z-10 flex flex-col justify-between bg-white border ${GLOW} p-4 md:p-6 overflow-y-auto cursor-pointer`}
        >
          <div>
            <h3 className="text-base md:text-lg font-bold mb-3">{project.title}</h3>

            <p className="text-sm leading-relaxed mb-4">{project.description}</p>

            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
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
          </div>

          {project.link && (
            <a
              href={project.link}
              className="text-sm font-bold underline"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              View project →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Deterministic on first render (server + first client paint match, so no
  // hydration mismatch), then reshuffled to genuine randomness once mounted.
  const [heights, setHeights] = useState<string[]>(() =>
    projects.map((_, i) => HEIGHT_BUCKETS[i % HEIGHT_BUCKETS.length])
  );

  // Cards fly in from the bottom as they scroll into view. Keyed by index to
  // an animation-delay in ms rather than a plain revealed flag: cards that
  // cross the intersection threshold in the same scroll tick (e.g. a whole
  // row of the masonry grid appearing at once) are sorted left-to-right and
  // given staggered delays, so they cascade in rather than popping together.
  const [revealedCards, setRevealedCards] = useState<Map<number, number>>(new Map());
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Deliberately reshuffling right after mount so every load looks
    // organically different — the deterministic initializer above exists
    // purely to keep this first client render matching the server-rendered
    // HTML (Math.random() can't run during the initial render itself
    // without risking a hydration mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeights(randomHeights());
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Reduced-motion users get every card visible immediately — no
      // observer, no fly-in.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReduceMotion(true);
      return;
    }

    // One-shot per card: once a card has scrolled into view and flown in,
    // stop watching it. Entries arriving in the same callback (i.e. the same
    // scroll tick) are sorted left-to-right so a whole row cascades in
    // instead of appearing simultaneously.
    const observer = new IntersectionObserver(
      (observedEntries) => {
        const newlyVisible = observedEntries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().left - b.target.getBoundingClientRect().left);
        if (newlyVisible.length === 0) return;

        setRevealedCards((prev) => {
          let next: Map<number, number> | null = null;
          newlyVisible.forEach((entry, i) => {
            const index = cardRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index === -1 || prev.has(index)) return;
            if (!next) next = new Map(prev);
            next.set(index, i * CARD_STAGGER_MS);
            observer.unobserve(entry.target);
          });
          return next ?? prev;
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // While a card's overlay is open, close it on Escape or on a mouse-down
  // anywhere outside that card — pressing off the card returns it to its
  // icon+title "cover" state.
  useEffect(() => {
    if (openIndex === null) return;
    const openIdx = openIndex;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
    }
    function onPointerDown(e: MouseEvent) {
      const openCard = cardRefs.current[openIdx];
      if (openCard && !openCard.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [openIndex]);

  function handleToggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 pt-10 md:pt-16 pb-10 md:pb-16">

      {/* ── Title ── */}
      <div className="inline-block align-top mb-10 md:mb-14">
        {/* Same editorial mask-reveal as the home hero and Experience header
            — see --animate-wipe-reveal in globals.css for why this is an
            opaque panel shrinking away rather than a clip-path on the text. */}
        <h1 className="relative text-5xl font-bold">
          Project Portfolio
          <span
            aria-hidden
            className="absolute inset-0 bg-background origin-right pointer-events-none motion-safe:animate-wipe-reveal"
          />
        </h1>
        <div
          className="h-0.75 w-1/2 mt-4 origin-left bg-linear-to-r from-[rgb(239,98,159)] to-[rgb(238,205,163)] motion-safe:animate-underline-draw motion-safe:[animation-delay:250ms]"
        />
      </div>

      {/* ── Projects: masonry icon-card grid ── */}
      <div className="columns-2 md:columns-3 gap-4 md:gap-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            heightClass={heights[index]}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
            cardRef={(el) => {
              cardRefs.current[index] = el;
            }}
            revealed={revealedCards.has(index)}
            revealDelayMs={revealedCards.get(index) ?? 0}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>

    </div>
  );
}
