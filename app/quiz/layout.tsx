import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check-in — Trait",
  description: "25 questions about how you usually think, act, and feel.",
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
