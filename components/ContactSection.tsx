"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Blob } from "./Blob";

// Gap between the two contact panels' fly-in — mirrors CARD_STAGGER_MS in
// app/portfolio/page.tsx so the "cascade left-to-right" motif reads the
// same wherever it shows up on the site.
const PANEL_STAGGER_MS = 120;
// How long after the section becomes visible the panels start flying in —
// gives the heading's wipe-reveal + underline-draw room to land first.
const PANEL_BASE_DELAY_MS = 450;

interface ContactPanel {
  href: string;
  label: string;
  iconSrc: string;
  iconAlt: string;
}

const panels: ContactPanel[] = [
  {
    href: "https://linkedin.com/in/hubert-krzemieniewski",
    label: "Connect on LinkedIn →",
    iconSrc: "/LinkedIn_icon.svg",
    iconAlt: "LinkedIn logo",
  },
  {
    href: "https://github.com/hubertkrzem",
    label: "Check out my GitHub →",
    iconSrc: "/GitHub_Invertocat_Black.svg",
    iconAlt: "GitHub logo",
  },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Reduced-motion users get the finished state immediately — no
      // observer, no wipe/underline/fly-in.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReduceMotion(true);
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    // One-shot: play the whole sequence the first time the section scrolls
    // into view, then stop watching — same pattern as Timeline.tsx and the
    // project cards on /portfolio.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const playing = revealed && !reduceMotion;

  return (
    <section id="contact" ref={sectionRef} className="max-w-6xl mx-auto p-4 pt-[5vh] w-full">
      <div className="inline-block align-top">
        {/* Same editorial mask-reveal as every other heading on the site —
            see --animate-wipe-reveal in globals.css. Gated on the JS
            `playing` state (rather than motion-safe:) since the reveal only
            starts once this section has scrolled into view. */}
        <h2 className="relative text-4xl font-bold">
          Get in touch
          {!reduceMotion && (
            <span
              aria-hidden
              className={`absolute inset-0 bg-background origin-right pointer-events-none ${
                playing ? "animate-wipe-reveal" : "scale-x-100"
              }`}
            />
          )}
        </h2>
        <div
          className={`h-0.75 w-1/2 mt-4 origin-left bg-linear-to-r from-[rgb(239,98,159)] to-[rgb(238,205,163)] ${
            reduceMotion ? "" : playing ? "animate-underline-draw" : "scale-x-0"
          }`}
          style={playing ? { animationDelay: "250ms" } : undefined}
        />
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 py-16 text-xl gap-12 md:gap-0">
        {panels.map((panel, i) => (
          <div
            key={panel.href}
            className={`flex flex-col items-center gap-8 ${
              reduceMotion ? "" : playing ? "animate-fly-in-bottom" : "opacity-0"
            }`}
            style={playing ? { animationDelay: `${PANEL_BASE_DELAY_MS + i * PANEL_STAGGER_MS}ms` } : undefined}
          >
            <div className="relative flex items-center justify-center w-64 h-64">
              <Blob
                size={200}
                points={8}
                radius={70}
                contrast={0.4}
                gradient={{ start: "rgb(238, 205, 163)", end: "rgb(239, 98, 159)", angle: 90 }}
                className="absolute inset-0 w-full h-full z-0 scale-[1.3] overflow-visible"
              />
              <a href={panel.href}>
                <Image src={panel.iconSrc} alt={panel.iconAlt} width={150} height={150} className="relative z-10" />
              </a>
            </div>
            <a href={panel.href} className="font-bold underline">
              {panel.label}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
