import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="w-full bg-[#0d1117] py-8 px-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Main footer card */}
        <div
          className="relative overflow-hidden rounded-2xl flex items-center justify-between gap-8 px-8 md:px-14 py-10"
          style={{
            background: "linear-gradient(135deg, #1a1f2e 0%, #252a3a 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            minHeight: "160px",
          }}
        >
          {/* Blue left accent bar */}
          <div
            className="absolute left-0 top-0 h-full"
            style={{
              width: "5px",
              background: "linear-gradient(180deg, #3b6ef5 0%, #1a3fd4 100%)",
            }}
          />

          {/* Diagonal blue slash decoration */}
          <div
            className="absolute left-0 top-0 h-full pointer-events-none"
            style={{
              width: "120px",
              background:
                "linear-gradient(105deg, rgba(59,110,245,0.18) 0%, transparent 60%)",
              clipPath: "polygon(0 0, 60% 0, 100% 100%, 0 100%)",
            }}
          />

          {/* Left: Title + Tagline */}
          <div className="relative z-10 flex flex-col gap-2 pl-4">
            <h2
              style={{
                fontFamily:
                  "'Dx Slight', 'Bank Gothic', 'Impact', 'Anton', sans-serif",
                fontSize: "clamp(36px, 5vw, 72px)",
                fontWeight: 700,
                lineHeight: 0.9,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                color: "#ffffff",
                fontStyle: "italic",
                margin: 0,
                textShadow: "2px 2px 0 rgba(0,0,0,0.3)",
              }}
            >
              JOIN THE AST
            </h2>
            <p
              style={{
                fontFamily: "'Rajdhani', 'Barlow', sans-serif",
                fontSize: "clamp(13px, 1.2vw, 16px)",
                fontWeight: 400,
                color: "rgba(255,255,255,0.55)",
                margin: 0,
                letterSpacing: "0.02em",
              }}
            >
              Where innovation takes flight.
            </p>
          </div>

          {/* Right: Logo + Social Icons */}
          <div className="relative z-10 flex flex-col items-end gap-4 shrink-0">
            {/* AST Logo top-right */}
            <div className="opacity-80">
              <Image
                src="/AST.png"
                alt="AST Club Logo"
                width={120}
                height={36}
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Social icons 2x2 grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1Bznkyfnde/?mibextid=wwXIfr"
                aria-label="Facebook"
                className="flex items-center justify-center rounded-full bg-white/10 hover:bg-[#3b6ef5] transition-colors duration-200"
                style={{ width: 44, height: 44 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/ast_.club?igsh=MW5wZTIya2g4d2FzNg=="
                aria-label="Instagram"
                className="flex items-center justify-center rounded-full bg-white/10 hover:bg-[#3b6ef5] transition-colors duration-200"
                style={{ width: 44, height: 44 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Email */}
              <a
                href="autonomous.systems.tech.club@gmail.com"
                aria-label="Email"
                className="flex items-center justify-center rounded-full bg-white/10 hover:bg-[#3b6ef5] transition-colors duration-200"
                style={{ width: 44, height: 44 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>

              {/* Discord */}
              <a
                href="https://discord.gg/PYQK7V4A"
                aria-label="Discord"
                className="flex items-center justify-center rounded-full bg-white/10 hover:bg-[#3b6ef5] transition-colors duration-200"
                style={{ width: 44, height: 44 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <p
          className="text-center mt-4"
          style={{
            fontFamily: "'Rajdhani', 'Barlow', sans-serif",
            fontSize: "12px",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.05em",
          }}
        >
          © {new Date().getFullYear()} AST Club — All rights reserved.
        </p>
      </div>
    </footer>
  );
}
