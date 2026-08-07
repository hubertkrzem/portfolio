import Image from "next/image";
import type { ExperienceEntry } from "@/lib/experience";

export default function Timeline({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <ol className="relative flex flex-col gap-14 md:gap-16 pl-12 md:pl-16">
      {/* vertical gradient spine */}
      <div className="absolute left-[11px] md:left-[15px] top-2 bottom-2 w-0.5 bg-linear-to-b from-[rgb(239,98,159)] to-[rgb(238,205,163)]" />

      {entries.map((entry, i) => (
        <li key={`${entry.company}-${entry.title}-${i}`} className="relative">
          {/* node marker */}
          <span className="absolute -left-12 md:-left-16 top-1 w-6 h-6 md:w-8 md:h-8 rounded-full bg-white border-2 border-black" />

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-black bg-white">
              <Image
                src={entry.image}
                alt={entry.imageAlt ?? `${entry.company} logo`}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <h3 className="text-2xl font-bold">{entry.title}</h3>
                <span className="text-sm font-bold text-black/50 shrink-0">{entry.period}</span>
              </div>
              <p className="text-lg font-bold">{entry.company}</p>
              <p className="mt-3 text-base leading-relaxed">{entry.description}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
