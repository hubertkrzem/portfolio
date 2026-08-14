import { Blob } from "../components/Blob";
import Button from "../components/Button";
import ContactSection from "../components/ContactSection";

export default function Home() {
  return (
    <main>
      <section id="hero" className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 max-w-6xl mx-auto w-full px-4 pb-16 md:pt-16 pt-10 min-h-[90vh] gap-8 md:gap-0 md:content-between">

        <h1 className="text-5xl font-bold md:col-start-1 md:row-start-1">
          {/* Each line reveals behind an opaque panel that shrinks away
              left-to-right (see --animate-wipe-reveal) rather than sliding
              in — a crisp editorial "printed on" reveal, staggered slightly
              so "Portfolio" lands just after the name. The panel technique
              (not clip-path on the text itself) is deliberate — see the
              comment on --animate-wipe-reveal in globals.css. */}
          <span className="relative block w-fit">
            Hubert Krzemieniewski
            {/* [transform:scaleX(0)] is the fallback when motion-safe:
                doesn't match (reduced motion) — without it this panel's
                default, un-animated state is "fully covering" (its natural
                size), permanently hiding the text. An active animation
                always overrides a plain declared value for the same
                property, so this has no effect once animate-wipe-reveal
                is running. */}
            <span
              aria-hidden
              className="absolute inset-0 bg-background origin-right pointer-events-none [transform:scaleX(0)] motion-safe:animate-wipe-reveal"
            />
          </span>
          {/* Wrapped so the underline below can size itself relative to just
              "Portfolio" (matching the /portfolio and /experience pages'
              title-underline pattern) rather than the full heading. */}
          <span className="inline-block align-top">
            <span className="relative inline-block">
              Portfolio
              <span
                aria-hidden
                className="absolute inset-0 bg-background origin-right pointer-events-none [transform:scaleX(0)] motion-safe:animate-wipe-reveal motion-safe:[animation-delay:120ms]"
              />
            </span>
            <span className="block h-0.75 w-1/2 mt-4 origin-left bg-linear-to-r from-[rgb(239,98,159)] to-[rgb(238,205,163)] motion-safe:animate-underline-draw motion-safe:[animation-delay:550ms]" />
          </span>
        </h1>

        <div className="flex items-center justify-center md:col-start-2 md:row-start-1 md:row-span-3 md:self-center">
          <Blob
            size={200}
            points={8}
            radius={70}
            contrast={0.4}
            gradient={{ start: "rgb(238, 205, 163)", end: "rgb(239, 98, 159)", angle: 90 }}
            className="w-full h-full overflow-visible"
          />
        </div>

        <p className="text-4xl md:col-start-1 md:row-start-2 motion-safe:animate-settle-up motion-safe:[animation-delay:400ms]">
          Product Manager Intern<br/>IBM, Ireland
        </p>

        <div className="flex flex-col gap-5 font-bold w-full md:w-1/2 md:col-start-1 md:row-start-3 md:self-end">
          <Button
            label="Download CV"
            link="/redacted_Hubert_Krzemieniewski_CV.pdf"
            className="hover:bg-gray-100 motion-safe:animate-settle-up motion-safe:[animation-delay:650ms]"
          />
          <Button
            label="Get In Touch"
            link="#contact"
            className="bg-black text-white hover:bg-mist-800 hover:border-black motion-safe:animate-settle-up motion-safe:[animation-delay:730ms]"
          />
        </div>

      </section>

      <ContactSection />
    </main>
  );
}
