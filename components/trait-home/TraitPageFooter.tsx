import Link from "next/link";

export function TraitPageFooter() {
  return (
    <footer className="relative border-t border-border/50 bg-elevated/40 py-12 text-center backdrop-blur-md sm:py-14">
      <div className="mx-auto max-w-md px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-xs leading-relaxed text-subtle sm:px-6 sm:text-sm">
        <p className="text-pretty">
          If you&apos;re in crisis, reach for real help — a hotline or clinician.
          This is for reflection, not emergencies.
        </p>
        <Link
          href="/quiz"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl bg-elevated/80 px-5 text-sm font-medium text-foreground shadow-[var(--shadow-sm)] transition-[transform,box-shadow] hover:shadow-[var(--shadow-md)] active:scale-[0.99] sm:mt-7 touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
        >
          Start quiz
        </Link>
      </div>
    </footer>
  );
}
