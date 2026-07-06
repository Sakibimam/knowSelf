"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import type { InterpretationsData } from "@/lib/interpretations";
import type { QuizResult } from "@/lib/quiz-types";

type Props = {
  open: boolean;
  onClose: () => void;
  identity: { eyebrow: string; label: string; lines: string[] };
  results: QuizResult[];
  interpretations: InterpretationsData;
  traitNames: Record<string, string>;
  quizTitle: string;
};

type Status = "idle" | "sending" | "sent" | "error";

export function EmailReportModal({
  open,
  onClose,
  identity,
  results,
  interpretations,
  traitNames,
  quizTitle,
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.includes("@")) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }

      setStatus("sending");
      setErrorMsg("");

      try {
        const res = await fetch("/api/send-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            identity,
            results,
            interpretations,
            traitNames,
            quizTitle,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Something went wrong.");
        }

        setStatus("sent");
      } catch (err) {
        setStatus("error");
        setErrorMsg(
          err instanceof Error ? err.message : "Something went wrong.",
        );
      }
    },
    [email, identity, results, interpretations, traitNames, quizTitle],
  );

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setEmail("");
      setStatus("idle");
      setErrorMsg("");
    }, 200);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-sm rounded-2xl border border-border/80 bg-background p-6 shadow-xl"
          >
            {status === "sent" ? (
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <svg
                    className="h-6 w-6 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  Report sent!
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Check your inbox at{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-5 min-h-10 w-full rounded-xl bg-accent px-4 text-sm font-semibold text-white dark:text-stone-950"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-base font-semibold text-foreground">
                  Get your report as PDF
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Enter your email and we&apos;ll send you the full personality
                  report.
                </p>

                <form onSubmit={handleSubmit} className="mt-4">
                  <label htmlFor="report-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    ref={inputRef}
                    id="report-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "sending"}
                    className="w-full rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-subtle outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                  />

                  {errorMsg && (
                    <p className="mt-2 text-xs text-red-500">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="mt-3 min-h-10 w-full rounded-xl bg-accent px-4 text-sm font-semibold text-white shadow-sm transition-[transform,box-shadow] hover:shadow-md active:scale-[0.99] disabled:opacity-60 dark:text-stone-950"
                  >
                    {status === "sending" ? "Sending…" : "Send report"}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-2 min-h-10 w-full rounded-xl px-4 text-sm text-muted hover:text-foreground"
                >
                  Cancel
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
