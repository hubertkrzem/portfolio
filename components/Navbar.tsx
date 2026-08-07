"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const LOGO_H     = 60;  // base logo height in px (h-15)
const PAD_Y      = 16;  // base vertical padding in px (py-4)
const SHRINK     = 0.5; // fraction to apply when scrolled — edit here to change the reduction
const SCROLL_IN  = 10;  // px scrolled down before navbar shrinks
const SCROLL_OUT = 0;   // px — restore only when fully back at top

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [navHeight, setNavHeight] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        if (!navRef.current) return;
        const ro = new ResizeObserver(() => {
            if (navRef.current) setNavHeight(navRef.current.offsetHeight);
        });
        ro.observe(navRef.current);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setScrolled(prev => {
                if (!prev && y > SCROLL_IN)  return true;
                if (prev  && y <= SCROLL_OUT) return false;
                return prev;
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    const logoH = scrolled ? LOGO_H * SHRINK : LOGO_H;
    const padY  = scrolled ? PAD_Y  * SHRINK : PAD_Y;

    const navLinks = [
        { label: "Home", href: "/", external: false },
        { label: "Portfolio", href: "/portfolio", external: false },
        { label: "Experience", href: "/experience", external: false },
        { label: "Resume", href: "/redacted_Hubert_Krzemieniewski_CV.pdf", external: true },
    ];

    return (
        <>
            <nav ref={navRef} className="sticky top-0 z-50 bg-white/75 backdrop-blur-sm border-b border-black font-satoshi">
                <div style={{ paddingTop: padY, paddingBottom: padY }} className="grid grid-cols-3 max-w-6xl mx-auto items-center w-full px-4 transition-[padding] duration-300 ease-in-out">
                    {/* LEFT: Logo */}
                    <div style={{ height: logoH }} className="relative w-fit transition-[height] duration-300 ease-in-out">
                        <Link href="/">
                            <Image
                                src="/logo-hk.svg"
                                alt="Site logo, black lowercase letters, h and k"
                                width={82}
                                height={63}
                                className="h-full w-auto object-contain cursor-pointer"
                                priority
                            />
                        </Link>
                    </div>

                    {/* CENTER: Nav links — hidden on mobile */}
                    <div className="hidden md:block">
                        <ul className="flex justify-center space-x-10 text-black text-xs font-bold">
                            <li><Link href="/portfolio">Portfolio</Link></li>
                            <li><Link href="/experience">Experience</Link></li>
                            <li><a href="/redacted_Hubert_Krzemieniewski_CV.pdf">Resume</a></li>
                        </ul>
                    </div>

                    {/* RIGHT: Contact (desktop) / Index toggle (mobile) */}
                    <div className="col-start-3">
                        <ul className="hidden md:flex justify-end space-x-3 text-black text-xs font-bold">
                            <li><a href="/#contact">Contact</a></li>
                        </ul>
                        <div className="md:hidden flex justify-end">
                            <button
                                onClick={() => setMenuOpen(true)}
                                className="text-black text-xs font-bold p-4 -m-4"
                            >
                                Index
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile slide-in menu */}
            <div className={`md:hidden fixed inset-0 z-100 ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={() => setMenuOpen(false)}
                />

                {/* Panel */}
                <div className={`absolute top-0 right-0 w-[78%] h-full bg-white flex flex-col transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
                    {/* Close button — height derived from measured navbar height */}
                    <div style={{ height: navHeight || undefined }} className="flex items-center justify-end px-6">
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="text-black text-2xl leading-none p-4 -m-4"
                            aria-label="Close menu"
                        >
                            ×
                        </button>
                    </div>

                    {/* Top divider */}
                    <div className="h-px bg-black/20 mx-4" />

                    {/* Nav links */}
                    <div className="flex-1 flex flex-col items-end px-8 pt-8 gap-8">
                        {navLinks.map((link) => {
                            const isActive = !link.external && pathname === link.href;
                            return (
                                <div key={link.href} className="flex flex-col items-end">
                                    {link.external ? (
                                        <a
                                            href={link.href}
                                            onClick={() => setMenuOpen(false)}
                                            className="text-[1.75rem] text-black font-satoshi"
                                        >
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            onClick={() => setMenuOpen(false)}
                                            className="text-[1.75rem] text-black font-satoshi"
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                    {isActive && (
                                        <div className="h-0.5 w-full bg-linear-to-r from-[rgb(239,98,159)] to-[rgb(238,205,163)]" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom divider */}
                    <div className="h-px bg-black/20 mx-4" />

                    {/* Contact */}
                    <div className="flex items-center justify-end px-8 h-23">
                        <a
                            href="/#contact"
                            onClick={() => setMenuOpen(false)}
                            className="text-[1.75rem] text-black font-satoshi"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}