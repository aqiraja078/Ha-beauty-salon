import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { PageLoader } from "@/components/layout/PageLoader";
import { PublicChrome } from "@/components/layout/PublicChrome";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileBookingBar } from "@/components/layout/MobileBookingBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageTransition } from "@/components/ui/PageTransition";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { getSiteContent } from "@/lib/content-store";
import { getMetadataBase } from "@/lib/public-site-url";
import { site } from "@/lib/site";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
  adjustFontFallback: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
  adjustFontFallback: true,
});

const metadataBase = getMetadataBase();

export const metadata: Metadata = {
  metadataBase,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  title: {
    default: `${site.name} | Home Beauty Services in Jhelum, Dina, Gujrat`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    locale: "en_PK",
    type: "website",
    url: "/",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#faf9f4",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteLive = await getSiteContent();

  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://i.pinimg.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="preconnect" href="https://i.pinimg.com" crossOrigin="" />
      </head>
      <body
        className={`${poppins.variable} ${playfair.variable} grain min-h-screen overflow-x-clip bg-canvas text-ink antialiased`}
      >
        <a
          href="#main-content"
          className="absolute left-[-9999px] top-0 z-[110] rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          Skip to main content
        </a>
        <JsonLd />
        <PageLoader />
        <PublicChrome>
          <ScrollProgress />
          <SiteHeader site={siteLive} />
        </PublicChrome>
        <main id="main-content" className="min-h-screen" tabIndex={-1}>
          <PageTransition>{children}</PageTransition>
        </main>
        <PublicChrome>
          <SiteFooter site={siteLive} />
          <WhatsAppButton site={siteLive} />
          <MobileBookingBar site={siteLive} />
        </PublicChrome>
      </body>
    </html>
  );
}
