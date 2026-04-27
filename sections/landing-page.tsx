import { SiteFooter } from "@/sections/site-footer";
import { SiteHeader } from "@/sections/site-header";

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Waiting on exact Figma specs for sections */}
        <section aria-label="Hero" className="px-4 py-12">
          <div className="mx-auto w-full max-w-6xl">
            <h1 className="text-balance text-3xl font-semibold tracking-tight">
              Landing page
            </h1>
            <p className="mt-4 max-w-prose text-pretty text-base text-neutral-600">
              Next.js 14 + TypeScript + Tailwind scaffold is ready. Once we can
              extract exact sizes/colors/typography from Figma, I’ll replace
              this placeholder with pixel-perfect sections.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

