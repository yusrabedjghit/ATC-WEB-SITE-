export function SiteFooter() {
  return (
    <footer className="w-full border-t border-neutral-200">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-neutral-600">
        <p>© {new Date().getFullYear()} ATC</p>
      </div>
    </footer>
  );
}

