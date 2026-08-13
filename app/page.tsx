import Image from "next/image";
import { Blob } from "../components/Blob";
import Button from "../components/Button";

export default function Home() {
  return (
    <main>
      <section id="hero" className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 max-w-6xl mx-auto w-full px-4 pb-16 md:pt-16 pt-10 min-h-[90vh] gap-8 md:gap-0 md:content-between">

        <h1 className="text-5xl font-bold md:col-start-1 md:row-start-1">
          <span className="block">Hubert Krzemieniewski</span>
          {/* Wrapped so the underline below can size itself relative to just
              "Portfolio" (matching the /portfolio and /experience pages'
              title-underline pattern) rather than the full heading. */}
          <span className="inline-block align-top">
            Portfolio
            <span className="block h-0.75 w-1/2 mt-4 bg-linear-to-r from-[rgb(239,98,159)] to-[rgb(238,205,163)]" />
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

        <p className="text-4xl md:col-start-1 md:row-start-2">Product Manager Intern<br/>IBM, Ireland</p>

        <div className="flex flex-col gap-5 font-bold w-full md:w-1/2 md:col-start-1 md:row-start-3 md:self-end">
          <Button label="Download CV" link="/redacted_Hubert_Krzemieniewski_CV.pdf" className="hover:bg-gray-100"/>
          <Button label="Get In Touch" link="#contact" className="bg-black text-white hover:bg-mist-800 hover:border-black"/>
        </div>

      </section>

      <section id="contact" className="max-w-6xl mx-auto p-4 w-full">
        <h2 className="text-4xl font-bold underline">Get in touch</h2>

        <div className="flex flex-col md:grid md:grid-cols-2 py-16 text-xl gap-12 md:gap-0">

          {/* LEFT: LinkedIn */}
          <div className="flex flex-col items-center gap-8">
            <div className="relative flex items-center justify-center w-64 h-64">
              <Blob
                size={200}
                points={8}
                radius={70}
                contrast={0.4}
                gradient={{ start: "rgb(238, 205, 163)", end: "rgb(239, 98, 159)", angle: 90 }}
                className="absolute inset-0 w-full h-full z-0 scale-[1.3] overflow-visible"
              />
              <a href="https://linkedin.com/in/hubert-krzemieniewski">
                <Image
                  src="/LinkedIn_icon.svg"
                  alt="LinkedIn logo"
                  width={150}
                  height={150}
                  className="relative z-10"
                />
              </a>
            </div>
            <a href="https://linkedin.com/in/hubert-krzemieniewski" className="font-bold underline">
              Connect on LinkedIn →
            </a>
          </div>

          {/* RIGHT: GitHub */}
          <div className="flex flex-col items-center gap-8">
            <div className="relative flex items-center justify-center w-64 h-64">
              <Blob
                size={200}
                points={8}
                radius={70}
                contrast={0.4}
                gradient={{ start: "rgb(238, 205, 163)", end: "rgb(239, 98, 159)", angle: 90 }}
                className="absolute inset-0 w-full h-full z-0 scale-[1.3] overflow-visible"
              />
              <a href="https://github.com/hubertkrzem">
                <Image
                  src="/GitHub_Invertocat_Black.svg"
                  alt="GitHub logo"
                  width={150}
                  height={150}
                  className="relative z-10"
                />
              </a>
            </div>
            <a href="https://github.com/hubertkrzem" className="font-bold underline">
              Check out my GitHub →
            </a>
          </div>

        </div>
      </section>
    </main>
  );
}
