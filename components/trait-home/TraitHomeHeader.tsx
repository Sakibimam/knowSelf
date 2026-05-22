import Link from "next/link";

export function TraitHomeHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-14 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-elevated focus:px-3 focus:py-2 focus:text-sm focus:text-foreground focus:shadow-md"
      >
        Skip to content
      </a>
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-3 px-4 pt-[max(0.25rem,env(safe-area-inset-top))] pb-3 sm:gap-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="font-display flex min-h-11 min-w-11 shrink-0 items-center text-lg font-medium leading-none tracking-tight text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
          aria-current="page"
        >
          Trait
        </Link>
        <nav className="flex shrink-0 items-center gap-2 sm:gap-3" aria-label="Site">
          <a
            href="#dimensions"
            className="inline-flex min-h-11 items-center justify-center rounded-full px-3 text-xs font-medium text-muted transition-colors hover:bg-elevated hover:text-foreground active:bg-elevated sm:px-4 sm:text-sm touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
          >
            Traits
          </a>
          <Link
            href="/quiz/dark-triad"
            className="inline-flex min-h-11 items-center justify-center rounded-full px-3 text-xs font-medium text-muted transition-colors hover:bg-elevated hover:text-foreground sm:px-4 sm:text-sm touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
          >
            Dark Triad
          </Link>
          <Link
            href="/quiz"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-accent px-4 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition-[transform,box-shadow] hover:shadow-[var(--shadow-md)] active:scale-[0.99] dark:text-stone-950 sm:px-5 touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
          >
            Big Five
          </Link>
        </nav>
      </div>
    </header>
  );
}
