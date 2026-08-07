import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-black font-satoshi">

            {/* MOBILE (hidden at md+) */}
            <div className="md:hidden pt-4 px-6 pb-8 space-y-6">

                {/* Two-column links */}
                <div className="grid grid-cols-2">
                    <div className="flex flex-col font-bold underline">
                        <Link href="/portfolio" className="text-lg py-2">Portfolio</Link>
                        <a href="/experience" className="text-lg py-2">Experience</a>
                        <Link href="/redacted_Hubert_Krzemieniewski_CV.pdf" className="text-lg py-2">Resume</Link>
                    </div>
                    <div className="flex flex-col items-left font-bold underline">
                        <a href="https://linkedin.com/in/hubert-krzemieniewski" className="text-lg py-2">LinkedIn</a>
                        <a href="https://github.com/hubertkrzem" className="text-lg py-2">Github</a>
                    </div>
                </div>

                <a href="#top" className="block text-lg font-bold underline pb-2 text-center scroll-smooth">↑ Back to top</a>

                <div className="flex items-center justify-center gap-4">
                    <Link href="/" className="block shrink-0">
                        <Image
                            src="/logo-hk.svg"
                            alt="Site logo, lowercase h and k"
                            width={82}
                            height={63}
                            className="h-15 w-auto object-contain cursor-pointer"
                        />
                    </Link>
                    <ul className="text-black text-xs font-bold">
                        <li>© 2026 Hubert Krzemieniewski.</li>
                        <li>All rights reserved.</li>
                    </ul>
                </div>

            </div>

            {/* DESKTOP (hidden below md) */}
            <div className="hidden md:block">
                <div className="grid grid-cols-2 max-w-6xl mx-auto items-center p-4 w-full">

                    {/* LEFT: Logo + copyright */}
                    <div className="flex items-center space-x-4">
                        <Link href="/">
                            <Image
                                src="/logo-hk.svg"
                                alt="Site logo, lowercase h and k"
                                width={82}
                                height={63}
                                className="h-15 w-auto object-contain cursor-pointer"
                            />
                        </Link>
                        <ul className="text-black text-xs font-bold">
                            <li>© 2026 Hubert Krzemieniewski.</li>
                            <li>All rights reserved.</li>
                        </ul>
                    </div>

                    {/* RIGHT: Links */}
                    <div className="flex justify-end space-x-10 text-black text-xs font-bold text-right underline">
                        <ul>
                            <li><a href="https://linkedin.com/in/hubert-krzemieniewski">LinkedIn</a></li>
                            <li><a href="https://github.com/hubertkrzem">Github</a></li>
                        </ul>
                        <ul>
                            <li><Link href="/portfolio">Portfolio</Link></li>
                            <li><a href="/experience">Experience</a></li>
                            <li><Link href="/redacted_Hubert_Krzemieniewski_CV.pdf">Resume</Link></li>
                        </ul>
                        <ul>
                            <li><a href="#top" className="scroll-smooth">Back to top</a></li>
                        </ul>
                    </div>

                </div>
            </div>

        </footer>
    );
}
