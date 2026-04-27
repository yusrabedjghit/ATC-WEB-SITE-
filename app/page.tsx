"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { SiteHeader } from "@/composents/site-header";
import { SiteFooter } from "@/composents/site-footer";

/* ──────────────────────────────────────────────
   SHARED HELPERS
────────────────────────────────────────────── */


function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function SplitHeading({
  white,
  blue,
  className = "",
}: {
  white: string;
  blue: string;
  className?: string;
}) {
  return (
    <h2 className={`font-['Bebas_Neue'] uppercase leading-none ${className}`}>
      <span className="text-white italic">{white} </span>
      <span className="italic" style={{ color: "#3b82f6" }}>{blue}</span>
    </h2>
  );
}

/* ──────────────────────────────────────────────
   SECTION 1 — HERO
────────────────────────────────────────────── */


function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(40px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {children}
    </div>
  );
}

function HeroSection() {
  return (
    <section id="home" className="relative flex flex-col items-center justify-center overflow-hidden bg-[#0b0f1a]" style={{ minHeight: "100vh" }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[0]">
        <Image src="/bg.png" alt="Background" fill style={{ objectFit: "cover", objectPosition: "center" }} priority />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.65), rgba(0,0,0,0.75))" }} />
      </div>

      <div className="relative z-[3] flex flex-col items-center text-center w-full px-4 sm:px-6">
        <h1 className="text-white" style={{
          fontFamily: "'Barlow Condensed', 'Impact', sans-serif",
          fontSize: "clamp(28px, 7vw, 110px)",
          fontWeight: "900",
          fontStyle: "italic",
          lineHeight: "1.1",
          letterSpacing: "2px",
          textTransform: "uppercase",
          textShadow: "0 0 20px rgba(37,99,235,0.5)",
        }}>
          AERIAL TECHNOLOGY CUP
        </h1>

        <p className="uppercase text-[#60a5fa]" style={{ marginTop: "10px", marginBottom: "20px", letterSpacing: "2px", fontSize: "clamp(8px, 1.5vw, 12px)" }}>
          EXCELLENCE IN AUTONOMOUS UAV TECHNOLOGY
        </p>

        <p className="uppercase" style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(8px, 1.5vw, 12px)", letterSpacing: "0.1em" }}>
          Ready To Take The Next Board?
        </p>

        <a href="#manifest" className="mt-5 inline-flex items-center justify-center rounded-full bg-[#2563eb] hover:bg-[#3b82f6] transition-colors duration-200 px-6 sm:px-8 py-3 font-bold tracking-[0.08em] text-white text-[11px] sm:text-[12px] uppercase shadow-[0_0_40px_rgba(37,99,235,0.7)]">
          ENGINEER THE NEXT FLIGHT
        </a>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION — ABOUT
────────────────────────────────────────────── */

function AboutSection() {
  return (
    <section id="about" className="py-12 md:py-24 px-4 sm:px-[var(--gutter)] relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(37,99,235,0.18) 0%, transparent 70%)" }} />

      <div className="relative z-10 mx-auto max-w-[var(--max-w)] flex flex-col items-center text-center">
        <SplitHeading white="About The" blue="Competition" className="text-[clamp(2rem,6vw,5rem)]" />
        <div className="mt-8 w-full max-w-3xl rounded-[1.5rem] md:rounded-[2rem] p-6 sm:p-8 md:p-14 text-left" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <p className="text-white/80 text-sm md:text-xl leading-[1.8]" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
            This Year&apos;s Competition Challenges Teams To Push The Limits Of Autonomous UAV Innovation.
          </p>
          <p className="mt-4 text-white/75 text-sm md:text-lg leading-relaxed" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
            Participants Will Design And Develop Intelligent Unmanned Aerial Vehicles Capable Of Operating Independently In Complex, Real-World Environments.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION — MISSION
────────────────────────────────────────────── */


function DroneImage() {
  const [colored, setColored] = useState(false);
  return (
    <div
      className="relative overflow-hidden cursor-pointer"
      style={{ minHeight: 260 }}
      onClick={() => setColored(!colored)}
      title="Click to reveal colors"
    >
      <Image
        src="/hero.png"
        alt="Drone"
        fill
        style={{
          objectFit: "cover",
          objectPosition: "left center",
          filter: colored ? "grayscale(0%)" : "grayscale(100%)",
          transition: "filter 0.6s ease",
        }}
      />
      {!colored && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/40 text-xs tracking-widest uppercase bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
          </span>
        </div>
      )}
    </div>
  );
}

function MissionSection() {
  return (
    <section id="TOPICS" className="py-12 md:py-20 px-4 sm:px-[var(--gutter)] relative overflow-hidden">
      <div className="mx-auto max-w-[var(--max-w)]">
        <div className="rounded-[1.5rem] md:rounded-[2rem] overflow-hidden grid grid-cols-1 lg:grid-cols-2" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
            <h3 className="font-['Bebas_Neue'] text-[clamp(2rem,6vw,4rem)] uppercase leading-none mb-4 text-white" style={{ letterSpacing: "0.02em" }}>
              The Mission Is Simple
            </h3>
            <p className="text-white/70 leading-relaxed mb-3 text-sm md:text-base" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
              Build Smarter, Safer, And More Efficient Autonomous Drone Systems.
            </p>
            <p className="text-white/70 leading-relaxed mb-6 text-sm md:text-base" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
              From Intelligent Navigation To AI-Driven Decision Making, This Competition Promotes Engineering Excellence, Creativity, And Real-World Problem-Solving In Next-Generation Aerial Robotics.
            </p>
            <a href="https://drive.google.com/drive/folders/1pMif7PAjgri_AEVO_54nIFx-2L-F5J0j?usp=sharing" target="_blank" rel="noopener noreferrer" 
              className="flex items-center justify-between w-full rounded-xl bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] hover:from-[#2563eb] hover:to-[#60a5fa] transition-all duration-300 px-4 sm:px-6 py-3 sm:py-4 group"
              style={{ border: "1px solid rgba(147,197,253,0.2)" }}>
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white shrink-0">
                  <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-[700] text-white tracking-widest text-xs sm:text-sm uppercase" style={{ fontFamily: "var(--font-body)" }}>VIEW FULL SPECIFICATIONS</span>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white shrink-0 transform group-hover:translate-x-1 transition-transform">
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <DroneImage />
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION — FOCUS AREAS
────────────────────────────────────────────── */

const FOCUS_AREAS = [
  { icon: (<svg viewBox="0 0 40 40" fill="none" width="40"><rect width="40" height="40" rx="10" fill="#2563eb" /><path d="M10 20h4M26 20h4M20 10v4M20 26v4" stroke="white" strokeWidth="2.5" strokeLinecap="round" /><rect x="13" y="13" width="14" height="14" rx="3" stroke="white" strokeWidth="2" /><path d="M17 20h6M20 17v6" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>), title: "AGILE HARDWARE", body: "Build modular and high-performance airframes capable of operating in dynamic, real-world scenarios." },
  { icon: (<svg viewBox="0 0 40 40" fill="none" width="40"><rect width="40" height="40" rx="10" fill="#2563eb" /><circle cx="20" cy="16" r="5" stroke="white" strokeWidth="2" /><path d="M12 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>), title: "ARTIFICIAL INTELLIGENCE", body: "Develop intelligent systems that learn, adapt, and make autonomous decisions in complex environments." },
  { icon: (<svg viewBox="0 0 40 40" fill="none" width="40"><rect width="40" height="40" rx="10" fill="#2563eb" /><rect x="10" y="10" width="20" height="20" rx="3" stroke="white" strokeWidth="2" /><rect x="15" y="15" width="10" height="10" rx="2" stroke="white" strokeWidth="2" /><circle cx="20" cy="20" r="2" fill="white" /></svg>), title: "EMBEDDED SYSTEMS", body: "Engineer precise control systems that interface hardware with software for optimal performance." },
  { icon: (<svg viewBox="0 0 40 40" fill="none" width="40"><rect width="40" height="40" rx="10" fill="#2563eb" /><circle cx="20" cy="20" r="8" stroke="white" strokeWidth="2" /><path d="M20 12v4M20 24v4M12 20h4M24 20h4" stroke="white" strokeWidth="2" strokeLinecap="round" /><circle cx="20" cy="20" r="2.5" fill="white" /></svg>), title: "AUTONOMOUS NAVIGATION", body: "Smart flight without human control — enabling drones to navigate complex environments independently." },
  { icon: (<svg viewBox="0 0 40 40" fill="none" width="40"><rect width="40" height="40" rx="10" fill="#2563eb" /><path d="M8 20h6M26 20h6" stroke="white" strokeWidth="2" strokeLinecap="round" /><circle cx="20" cy="20" r="5" stroke="white" strokeWidth="2" /></svg>), title: "OBSTACLE AVOIDANCE", body: "Real-time detection and adaptive response to dynamic obstacles for safe autonomous flight." },
  { icon: (<svg viewBox="0 0 40 40" fill="none" width="40"><rect width="40" height="40" rx="10" fill="#2563eb" /><circle cx="13" cy="14" r="4" stroke="white" strokeWidth="2" /><circle cx="27" cy="14" r="4" stroke="white" strokeWidth="2" /><circle cx="20" cy="28" r="4" stroke="white" strokeWidth="2" /><line x1="17" y1="14" x2="23" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>), title: "COOPERATIVE DRONE COORDINATION", body: "Multi-drone collaboration enabling synchronized missions and intelligent swarm behavior." },
  { icon: (<svg viewBox="0 0 40 40" fill="none" width="40"><rect width="40" height="40" rx="10" fill="#2563eb" /><path d="M20 8l4 8h8l-6.5 5 2.5 8L20 24l-8 5 2.5-8L8 16h8z" stroke="white" strokeWidth="2" strokeLinejoin="round" /></svg>), title: "CONCEPTION & DESIGN", body: "Innovative and efficient UAV structures pushing the boundaries of aerodynamic and mechanical design." },
];

function FocusSection() {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animFrame: number;
    let pos = 0;
    const step = () => {
      if (!isPaused.current && el) {
        pos += 0.5;
        if (pos >= el.scrollWidth / 2) pos = 0;
        el.scrollLeft = pos;
      }
      animFrame = requestAnimationFrame(step);
    };
    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  const allCards = [...FOCUS_AREAS, ...FOCUS_AREAS];

  return (
    <section id="focus" className="py-12 md:py-20 overflow-hidden">
      <div className="px-4 sm:px-[var(--gutter)] mx-auto max-w-[var(--max-w)]">
        <h2 className="font-['Bebas_Neue'] uppercase leading-none text-[clamp(2rem,6vw,5rem)] mb-3">
          <span className="text-white italic">Focus </span>
          <span className="italic text-[#3b82f6]">Areas</span>
        </h2>
        <p className="text-white/55 mb-8 max-w-2xl text-sm md:text-base" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
          This Year, Technologies Converge To Create Drones Capable Of Making Autonomous In-Flight Intelligent Decisions.
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-8"
        style={{ scrollbarWidth: "none", cursor: "grab" }}
        onMouseEnter={() => { isPaused.current = true; }}
        onMouseLeave={() => { isPaused.current = false; }}
        onTouchStart={() => { isPaused.current = true; }}
        onTouchEnd={() => { isPaused.current = false; }}
      >
        {allCards.map(({ icon, title, body }, idx) => {
          const isActive = activeCard === title;
          return (
            <div
              key={`${title}-${idx}`}
              onClick={() => setActiveCard(isActive ? null : title)}
              className="shrink-0 w-[220px] sm:w-[260px] md:w-[280px] cursor-pointer rounded-[1.5rem] p-5 sm:p-6 flex flex-col gap-4 transition-all duration-300"
              style={{
                background: isActive ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                border: isActive ? "2px solid rgba(59,130,246,0.8)" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl" style={{ background: "rgba(37,99,235,.15)" }}>{icon}</div>
              <h3 className="font-['Bebas_Neue'] text-base sm:text-xl" style={{ letterSpacing: "0.08em" }}>{title}</h3>
              <p className="text-white/55 text-xs sm:text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>{body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION — MANIFEST
────────────────────────────────────────────── */

function InputField({ label, placeholder, type = "text", name, required }: {
  label: string; placeholder: string; type?: string; name?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-[700] tracking-widest uppercase" style={{ fontFamily: "var(--font-body)", color: "#60a5fa" }}>{label}</label>
      <input type={type} name={name} required={required} placeholder={placeholder}
        className="w-full rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border border-white/20 text-white placeholder-white/25 text-xs sm:text-sm focus:outline-none focus:border-[#3b82f6] transition-colors duration-200"
        style={{ fontFamily: "var(--font-body)" }} />
    </div>
  );
}

function MemberBlock({ label, prefix }: { label: string; prefix: string }) {
  return (
    <div className="p-4 md:p-6 rounded-xl w-full" style={{ border: "1.5px dotted rgba(37,99,235,.6)" }}>
      <h4 className="text-xs font-[700] tracking-widest uppercase mb-3 sm:mb-4" style={{ fontFamily: "var(--font-body)", color: "#60a5fa" }}>{label}</h4>
      <div className="flex flex-col gap-3">
        <InputField name={`${prefix}Name`} label="Full Name" placeholder="Full Name" />
        <div className="flex flex-col sm:flex-row gap-3">
          <InputField name={`${prefix}Phone`} label="Phone Number" placeholder="0xxxxxxxxx" type="tel" />
          <InputField name={`${prefix}Email`} label="Email Address" placeholder="Your@Email.Com" type="email" />
        </div>
      </div>
    </div>
  );
}

function ManifestSection() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    const fd = new FormData(e.currentTarget);
    const participants: any[] = [{ fullName: fd.get("leaderName") as string, phone: fd.get("leaderPhone") as string, email: fd.get("leaderEmail") as string, role: "leader" }];
    for (let i = 2; i <= 5; i++) {
      const pName = fd.get(`member${i}Name`) as string;
      if (pName?.trim()) participants.push({ fullName: pName, phone: fd.get(`member${i}Phone`) as string, email: fd.get(`member${i}Email`) as string, role: "member" });
    }
    try {
      const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ teamName: fd.get("teamName"), robotName: fd.get("robotName"), experienceLevel: fd.get("experienceLevel"), participants }) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to register team.");
      setSuccessMsg("Crew registered successfully! See you on the flight deck.");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="manifest" className="py-12 md:py-20 px-4 sm:px-[var(--gutter)] w-full">
      <div className="mx-auto max-w-[var(--max-w)] w-full">
        <SplitHeading white="Flight" blue="Manifest" className="text-[clamp(2rem,6vw,5rem)] mb-2" />
        <p className="text-white/55 mb-6 md:mb-10 text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>Register Your Crew. Secure Your Spot.</p>

        <form onSubmit={handleSubmit} className="rounded-[1.5rem] md:rounded-[2rem] p-4 sm:p-6 md:p-10 w-full" style={{ border: "1px dashed rgba(37,99,235,.3)" }}>
          <div className="flex flex-col gap-4 w-full">
            <div className="p-4 md:p-6 rounded-xl" style={{ border: "1.5px dotted rgba(37,99,235,.6)" }}>
              <div className="flex flex-col gap-3">
                <InputField label="Team Name *" name="teamName" placeholder="Enter Your Team Name" required />
                <InputField label="Name Of Team Leader *" name="leaderName" placeholder="Enter Name Of Team Leader" required />
                <div className="flex flex-col sm:flex-row gap-3">
                  <InputField label="Phone Number*" name="leaderPhone" placeholder="0xxxxxxxxx" type="tel" required />
                  <InputField label="Email Address" name="leaderEmail" placeholder="Your@Email.Com" type="email" />
                </div>
              </div>
            </div>

            <MemberBlock label="Member 2 (Optional)" prefix="member2" />
            <MemberBlock label="Member 3 (Optional)" prefix="member3" />
            <MemberBlock label="Member 4 (Optional)" prefix="member4" />
            <MemberBlock label="Member 5 (Optional)" prefix="member5" />

            <div className="p-4 md:p-6 rounded-xl" style={{ border: "1.5px dotted rgba(37,99,235,.6)" }}>
              <div className="flex flex-col sm:flex-row gap-3">
                <InputField label="Robot Name *" name="robotName" placeholder="Dronezxxx" required />
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-[700] tracking-widest uppercase" style={{ fontFamily: "var(--font-body)", color: "#60a5fa" }}>Experience Level *</label>
                  <select name="experienceLevel" required defaultValue="" className="w-full rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border border-white/20 text-white/40 text-xs sm:text-sm focus:outline-none focus:border-[#3b82f6] transition-colors duration-200 appearance-none cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
                    <option value="" disabled className="bg-[#111118]">Select Level</option>
                    <option value="beginner" className="bg-[#111118] text-white">Beginner</option>
                    <option value="intermediate" className="bg-[#111118] text-white">Intermediate</option>
                    <option value="advanced" className="bg-[#111118] text-white">Advanced</option>
                    <option value="expert" className="bg-[#111118] text-white">Expert</option>
                  </select>
                </div>
              </div>
            </div>

            {errorMsg && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-xs text-center">{errorMsg}</div>}
            {successMsg && <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-lg text-xs text-center">{successMsg}</div>}

            <div className="flex justify-center pt-2">
              <button type="submit" disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-[#2563eb] hover:bg-[#3b82f6] disabled:opacity-50 transition-colors duration-200 px-8 sm:px-14 py-3 sm:py-4 font-[700] tracking-[0.15em] uppercase text-white text-xs sm:text-sm w-full sm:w-auto"
                style={{ fontFamily: "var(--font-body)" }}>
                {loading ? "INITIALIZING..." : "ENGINEER THE NEXT FLIGHT"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION — FAQ
────────────────────────────────────────────── */

const FAQS = [
  { q: "How many team members are allowed?", a: "Each team can have from 1 to 5 members." },
  { q: "When will the event take place?", a: "The event will take place in mid-April." },
  { q: "Where will the event take place?", a: "The event will take place at the National Higher School of Autonomous Systems Technology." },
  { q: "Can I participate in multiple topics?", a: "Yes, you can participate in more than one topic." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 sm:p-6 text-left" aria-expanded={open}>
        <span className="text-sm md:text-lg font-[600] text-white/90 pr-4" style={{ fontFamily: "var(--font-body)" }}>{q}</span>
        <svg className="shrink-0 text-[#3b82f6] transition-transform duration-300" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }} width="18" height="18" viewBox="0 0 16 16" fill="none">
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open ? "300px" : "0px" }}>
        <p className="px-4 sm:px-6 pb-4 text-xs sm:text-base text-white/60 leading-relaxed" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>{a}</p>
      </div>
    </div>
  );
}

function FaqSection() {
  return (
    <section className="py-12 md:py-24 px-4 sm:px-[var(--gutter)]">
      <div className="mx-auto max-w-[var(--max-w)] grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8 md:gap-20 items-start">
        <div>
          <h2 className="font-['Bebas_Neue'] uppercase leading-none text-[clamp(2.5rem,7vw,5.5rem)] text-white mb-4" style={{ letterSpacing: "0.02em" }}>
            FREQUENTLY<br /><span className="italic text-[#3b82f6]">ASKED</span><br />QUESTIONS
          </h2>
          <p className="text-white/60 text-sm md:text-lg leading-relaxed" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
            Got questions? We&apos;re here to give you all the information you need.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map((faq) => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION — ABOUT US
────────────────────────────────────────────── */

const TEAM_IMAGES = [
  "/team/Copy of IMG_4247 (1).jpg",
  "/team/Copy of IMG_4323 (1).JPG",
  "/team/ast_.club_14041010_013029167.jpg",
  "/team/ast_.club_14041010_013117346.jpg",
  "/team/ast_.club_14041010_013146523.jpg",
  "/team/ast_.club_14041010_013220617.jpg",
  "/team/ast_.club_14041010_013223427.jpg",
  "/team/ast_.club_14041010_013239281.jpg",
  "/team/team1.jpg",
];

function TeamCarousel() {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i === 0 ? TEAM_IMAGES.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === TEAM_IMAGES.length - 1 ? 0 : i + 1));
  return (
    <div className="relative w-full min-h-[220px] sm:min-h-[300px] overflow-hidden rounded-xl">
      {TEAM_IMAGES.map((src, i) => (
        <div key={src} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? "auto" : "none" }}>
          <Image src={src} alt={`Team ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
      ))}
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-[#3b82f6] text-white flex items-center justify-center border border-white/20 transition-colors z-10" aria-label="Previous">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-[#3b82f6] text-white flex items-center justify-center border border-white/20 transition-colors z-10" aria-label="Next">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
      </button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {TEAM_IMAGES.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-5 bg-[#3b82f6]" : "w-1.5 bg-white/40"}`} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

function AboutUsSection() {
  return (
    <section id="about-us" className="py-12 md:py-20 px-4 sm:px-[var(--gutter)]">
      <div className="mx-auto max-w-[var(--max-w)]">
        <div className="rounded-[1.5rem] md:rounded-[2rem] p-6 sm:p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div>
            <h2 className="font-['Bebas_Neue'] uppercase italic leading-none text-[clamp(2rem,5vw,4rem)] text-white mb-2">About Us</h2>
            <p className="text-[#60a5fa] text-xs font-[700] tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-body)" }}>AST TEAM</p>
            <p className="text-white/65 text-sm md:text-base leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
              The Autonomous Systems Technologies Club (AST Club) is the first and only scientific club of the National Higher School Of Autonomous Systems Technologies. Founded in 2024, it is the student-led hub for innovation in autonomous and intelligent systems.
            </p>
            <p className="text-white/65 text-sm md:text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
              The club&apos;s mission is to provide a practical engineering environment where members develop deep technical expertise through collaborative hands-on projects and specialized workshops.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden relative" style={{ minHeight: 220, background: "rgba(8,8,16,0.7)", border: "1px solid rgba(37,99,235,.2)" }}>
            <TeamCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   ROOT EXPORT
────────────────────────────────────────────── */

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="pt-[70px] md:pt-[88px]">
        <HeroSection />
        <AnimatedSection><AboutSection /></AnimatedSection>
        <AnimatedSection><MissionSection /></AnimatedSection>
        <AnimatedSection><FocusSection /></AnimatedSection>
        <AnimatedSection><ManifestSection /></AnimatedSection>
        <AnimatedSection><FaqSection /></AnimatedSection>
        <AnimatedSection><AboutUsSection /></AnimatedSection>
      </main>
      <SiteFooter />
    </>
  );
}