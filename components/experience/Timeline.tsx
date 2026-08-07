import Image from "next/image";
import type { ExperienceEntry } from "@/lib/experience";

export default function Timeline({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <ol className="relative flex flex-col gap-8 md:gap-10 pl-12 md:pl-16">
      {/* dashed gradient rail — centered under the marker badges below */}
      <div
        aria-hidden
        className="absolute left-6 md:left-8 top-2 bottom-2 border-l-2 border-dashed"
        style={{ borderImage: "linear-gradient(to bottom, rgb(239,98,159), rgb(238,205,163)) 1" }}
      />

      {entries.map((entry, i) => (
        <li key={`${entry.company}-${entry.title}-${i}`} className="relative group">
          {/*
            rail marker — the rail div above is positioned relative to <ol> (at
            half its own left-padding, i.e. centered in the gutter), but this
            span is positioned relative to <li>, which starts *after* that
            padding. So its anchor has to be pulled back by the full padding
            amount, then re-centered on itself via -translate-x-1/2.
          */}
          <span className="absolute -left-6 md:-left-8 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center border border-black bg-white font-mono text-xs font-bold">
            {String(i + 1).padStart(2, "0")}
          </span>

          <article className="border border-black bg-white p-6 md:p-8 transition-all duration-200 group-hover:border-[rgb(239,98,159)] group-hover:shadow-[0_0_10px_-4px_rgba(239,98,159,0.35)]">
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
          </article>
        </li>
      ))}
    </ol>
  );
}
