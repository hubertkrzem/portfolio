import Timeline from "@/components/experience/Timeline";
import { experience } from "@/lib/experience";

export default function ExperiencePage() {
  return (
    <main>
      <section className="max-w-6xl mx-auto w-full px-4 pt-10 md:pt-16">
        <div className="inline-block align-top mb-10 md:mb-14">
          <h1 className="text-5xl font-bold">Experience</h1>
          <div className="h-0.75 w-1/2 mt-4 bg-linear-to-r from-[rgb(239,98,159)] to-[rgb(238,205,163)]" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto w-full px-4 pb-24">
        <Timeline entries={experience} />
      </section>
    </main>
  );
}
