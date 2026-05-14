import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        KnowSelf
      </h1>
      <p className="max-w-sm text-muted">
        A short Big Five quiz with plain-language trait notes. Not clinical.
      </p>
      <Link
        href="/quiz"
        className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white shadow-surface transition hover:opacity-90"
      >
        Start the quiz
      </Link>
    </main>
  );
}
