import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="w-full">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" aria-label="Home" className="font-semibold">
          ATC
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-4">
          <a href="#!" className="text-sm">
            Link 1
          </a>
          <a href="#!" className="text-sm">
            Link 2
          </a>
        </nav>
      </div>
    </header>
  );
}

