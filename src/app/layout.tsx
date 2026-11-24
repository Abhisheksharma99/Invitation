import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Gochi_Hand, Great_Vibes, Tiro_Devanagari_Hindi } from "next/font/google";
import { wedding } from "@content/wedding";
import { GATE_BOOT_SCRIPT } from "@/lib/gate";
import { MotionProvider } from "@/components/motion/MotionProvider";
import "./globals.css";

const script = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const devanagari = Tiro_Devanagari_Hindi({
  variable: "--font-tiro-devanagari",
  weight: "400",
  subsets: ["devanagari"],
  display: "swap",
});

// Dhruvi's line only: a child's handwriting
const hand = Gochi_Hand({
  variable: "--font-gochi-hand",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// Link previews need an absolute address. On Vercel it is known at build time;
// anywhere else set NEXT_PUBLIC_SITE_URL.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const title = wedding.couple.line;
const description = `${wedding.couple.line}, ${wedding.couple.date}`;
const preview = { url: "/og.jpg", width: 1200, height: 630, alt: description };

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  // family phone numbers are on the page: keep it out of search engines
  robots: { index: false, follow: false },
  openGraph: { type: "website", title, description, images: [preview] },
  twitter: { card: "summary_large_image", title, description, images: [preview] },
};

export const viewport: Viewport = {
  themeColor: "#4a0d1c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning // the boot script below may add data-gate before hydration
      className={`${script.variable} ${serif.variable} ${devanagari.variable} ${hand.variable} antialiased`}
    >
      <body>
        <script
          type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: GATE_BOOT_SCRIPT }}
        />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
