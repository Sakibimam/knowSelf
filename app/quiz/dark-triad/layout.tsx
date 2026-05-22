import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dirty Dozen — Dark Triad",
  description:
    "12 questions on Machiavellianism, psychopathy traits, and narcissism. Informational only, not a diagnosis.",
};

export default function DarkTriadQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
