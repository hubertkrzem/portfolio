"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ExperienceEntry } from "@/lib/experience";

// Must match the duration baked into --animate-rail-grow in globals.css —
// marker/card delays below are fractions of this so they land in sync with
// the rail visually reaching each marker's position.
const RAIL_DURATION_MS = 900;
// How long after its marker fades in a card flies in from the left.
const CARD_DELAY_MS = 120;

export default function Timeline({ entries }: { entries: ExperienceEntry[] }) {
  const trackRef = useRef<HTMLOListElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Reduced-motion users get the finished state immediately — no rail
      // growth, marker fade, or card fly-in.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReduceMotion(true);
      return;
    }

    const track = trackRef.current;
    if (!track) return;

    // One-shot: play the whole sequence the first time the timeline
    // scrolls into view, then stop watching.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const playing = revealed && !reduceMotion;

  return (
    <ol ref={trackRef} className="relative flex flex-col gap-8 md:gap-10 pl-12 md:pl-16">
      {/* solid gradient rail — flies in from the top once the timeline
          scrolls into view; reduced-motion users get it fully drawn. */}
      <div
        aria-hidden
        className={`absolute left-6 md:left-8 top-2 bottom-2 w-0.5 origin-top ${
          playing ? "animate-rail-grow" : reduceMotion ? "" : "scale-y-0"
        }`}
        style={{ backgroundImage: "linear-gradient(to bottom, rgb(239,98,159), rgb(238,205,163))" }}
      />

      {entries.map((entry, i) => {
        // Fraction of the way down the rail this marker sits, used to time
        // its fade-in against rail-grow's progress.
        const delayMs = Math.round((i / entries.length) * RAIL_DURATION_MS);

        return (
          <li key={`${entry.company}-${entry.title}-${i}`} className="relative group">
            {/*
              rail marker — the rail div above is positioned relative to <ol> (at
              half its own left-padding, i.e. centered in the gutter), but this
              span is positioned relative to <li>, which starts *after* that
              padding. So its anchor has to be pulled back by the full padding
              amount, then re-centered on itself via -translate-x-1/2.
            */}
            <span
              className={`absolute -left-6 md:-left-8 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center border border-black bg-white font-mono text-xs font-bold ${
                playing ? "animate-marker-fade" : reduceMotion ? "" : "opacity-0"
              }`}
              style={playing ? { animationDelay: `${delayMs}ms` } : undefined}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <article
              className={`border border-black bg-white p-6 md:p-8 transition-all duration-200 group-hover:border-[rgb(239,98,159)] group-hover:shadow-[0_0_10px_-4px_rgba(239,98,159,0.35)] ${
                playing ? "animate-fly-in-left" : reduceMotion ? "" : "opacity-0"
              }`}
              style={playing ? { animationDelay: `${delayMs + CARD_DELAY_MS}ms` } : undefined}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="shrink-0 w-12 h-12 p-1.5 border border-black/20 overflow-hidden bg-white">
                    <Image
                      src={entry.image}
                      alt={entry.imageAlt ?? `${entry.company} logo`}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold transition-colors duration-200 group-hover:text-[rgb(239,98,159)]">
                      {entry.title}
                    </h3>
                    <p className="text-sm md:text-base font-bold text-black/60">{entry.company}</p>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-start sm:items-end gap-1.5">
                  <span className="font-mono text-xs font-bold border border-black/20 px-2 py-1">
                    {entry.period}
                  </span>
                  {entry.employmentType && (
                    <span className="font-mono text-xs uppercase tracking-wide text-black/40">
                      {entry.employmentType}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-base leading-relaxed text-black/80">{entry.description}</p>

              {entry.bullets && entry.bullets.length > 0 && (
                <ul className="flex flex-col gap-2 mt-3">
                  {entry.bullets.map((point, j) => (
                    <li key={j} className="flex gap-2 text-base leading-relaxed text-black/80">
                      <span className="shrink-0 text-black/40">›</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </li>
        );
      })}
    </ol>
  );
}
