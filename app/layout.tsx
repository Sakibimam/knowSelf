import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const siteUrl = getSiteUrl();
const siteDescription =
  "Big Five and Dark Triad quizzes with plain-language trait notes. Not clinical.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Trait",
    template: "%s · Trait",
  },
  description: siteDescription,
  applicationName: "Trait",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo.svg",
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Trait",
    title: "Trait",
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Trait — Big Five and Dark Triad trait notes",
      },
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: "Trait logo",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trait",
    description: siteDescription,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4f1" },
    { media: "(prefers-color-scheme: dark)", color: "#121110" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body
        className={`${dmSans.className} min-h-full flex flex-col pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]`}
      >
        {children}
      </body>
    </html>
  );
}
