import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/footer/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#07080f" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "UNISAVE — Free Universal Online Media & Video Downloader | ZAYA CODE HUB",
    template: "%s | UNISAVE — ZAYA CODE HUB",
  },
  description:
    "UNISAVE by ZAYA CODE HUB (zayacodehub.in) is a 100% free universal media toolkit. Download videos, reels, posts, and audio from YouTube, Instagram, TikTok without watermark, Facebook, Twitter/X, Reddit, Pinterest, and Vimeo.",
  keywords: [
    "UNISAVE",
    "ZAYA CODE HUB",
    "zayacodehub.in",
    "free video downloader",
    "online media downloader",
    "youtube video downloader",
    "youtube shorts downloader",
    "instagram reel downloader",
    "tiktok downloader no watermark",
    "twitter video downloader",
    "facebook video downloader",
    "reddit video downloader",
    "pinterest video downloader",
    "universal media downloader",
    "download video online free",
  ],
  authors: [{ name: "ZAYA CODE HUB", url: "https://zayacodehub.in" }],
  creator: "ZAYA CODE HUB",
  publisher: "ZAYA CODE HUB",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://zayacodehub.in"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "UNISAVE — Free Universal Online Media & Video Downloader | ZAYA CODE HUB",
    description:
      "Save videos, reels, posts, and audio from YouTube, Instagram, TikTok, Twitter/X, and more with UNISAVE by ZAYA CODE HUB. 100% Free & Unlimited.",
    url: "https://zayacodehub.in",
    siteName: "UNISAVE by ZAYA CODE HUB",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/icon.svg",
        width: 1200,
        height: 630,
        alt: "UNISAVE — Universal Media Toolkit by ZAYA CODE HUB",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UNISAVE — Free Universal Online Media Downloader | ZAYA CODE HUB",
    description:
      "100% Free online media & video downloader for YouTube, Instagram Reels, TikTok, and Twitter by ZAYA CODE HUB.",
    creator: "@zayacodehub",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://zayacodehub.in/#webapp",
      "name": "UNISAVE",
      "alternateName": [
        "UNISAVE Media Downloader",
        "UNISAVE Universal Media Toolkit",
        "ZAYA CODE HUB Media Downloader",
      ],
      "url": "https://zayacodehub.in",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "description":
        "Free universal online media downloader by ZAYA CODE HUB. Save videos, reels, and audio from YouTube, Instagram, TikTok without watermark, Facebook, Twitter/X, Reddit, Pinterest, and Vimeo.",
      "publisher": {
        "@type": "Organization",
        "name": "ZAYA CODE HUB",
        "url": "https://zayacodehub.in",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://zayacodehub.in/#organization",
      "name": "ZAYA CODE HUB",
      "url": "https://zayacodehub.in",
      "logo": "https://zayacodehub.in/icon.svg",
      "sameAs": ["https://zayacodehub.in"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <ThemeProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}

