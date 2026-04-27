"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const NAV = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT EVENT", href: "#about" },
  { label: "TOPICS", href: "#focus" },
  { label: "ABOUT US", href: "#about-us" },
];

export function SiteHeader() {
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Track scroll for background + active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Find active section
      const sections = NAV.map((n) => n.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(`#${sections[i]}`);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on resize
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8,8,16,0.95)" : "rgba(8,8,16,0.75)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="mx-auto max-w-[var(--max-w)] px-4 sm:px-[var(--gutter)] h-[70px] md:h-[88px] flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0" aria-label="Aerial Technology Cup">
          <Image
            src="/logo.png"
            alt="ATC Logo"
            width={220}
            height={52}
            className="w-[160px] sm:w-[180px] md:w-[210px] h-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-1 border border-white/15 rounded-full px-3 py-2"
        >
          {NAV.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActive(link.href)}
                className="px-4 lg:px-6 py-2 rounded-full text-[11px] lg:text-[12px] font-[700] tracking-widest uppercase whitespace-nowrap transition-all duration-300"
                style={{
                  fontFamily: "var(--font-body)",
                  background: isActive ? "rgba(37,99,235,0.85)" : "transparent",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                  boxShadow: isActive ? "0 0 16px rgba(37,99,235,0.4)" : "none",
                }}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg border border-white/15 hover:border-white/30 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: menuOpen ? "300px" : "0px" }}
      >
        <nav className="flex flex-col px-4 pb-4 gap-1" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {NAV.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => { setActive(link.href); setMenuOpen(false); }}
                className="px-4 py-3 rounded-xl text-[12px] font-[700] tracking-widest uppercase transition-all duration-200"
                style={{
                  fontFamily: "var(--font-body)",
                  background: isActive ? "rgba(37,99,235,0.2)" : "transparent",
                  color: isActive ? "#60a5fa" : "rgba(255,255,255,0.7)",
                  borderLeft: isActive ? "3px solid #3b82f6" : "3px solid transparent",
                }}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
