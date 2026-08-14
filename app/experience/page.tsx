import Timeline from "@/components/experience/Timeline";
import { experience } from "@/lib/experience";

export default function ExperiencePage() {
  return (
    <main>
      <section className="max-w-6xl mx-auto w-full px-4 pt-10 md:pt-16">
        <div className="inline-block align-top mb-10 md:mb-14">
          {/* Same editorial mask-reveal as the home hero and Projects header
              — see --animate-wipe-reveal in globals.css for why this is an
              opaque panel shrinking away rather than a clip-path on the text. */}
          <h1 className="relative text-5xl font-bold">
            Experience
            {/* [transform:scaleX(0)] fallback for when motion-safe: doesn't
                match — see the matching comment in app/page.tsx. Without it
                the panel's un-animated default is "fully covering". */}
            <span
              aria-hidden
              className="absolute inset-0 bg-background origin-right pointer-events-none [transform:scaleX(0)] motion-safe:animate-wipe-reveal"
            />
          </h1>
          <div
            className="h-0.75 w-1/2 mt-4 origin-left bg-linear-to-r from-[rgb(239,98,159)] to-[rgb(238,205,163)] motion-safe:animate-underline-draw motion-safe:[animation-delay:250ms]"
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto w-full px-4 pb-24">
        <Timeline entries={experience} />
      </section>
    </main>
  );
}
