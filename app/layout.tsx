/**
 * @file layout.tsx
 * @description Root layout shared across all routes. Sets up global fonts, metadata, theme provider, and analytics.
 */

import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import "highlight.js/styles/github.min.css"

import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://md.tristanbudd.com"),
  title: "Markdown Editor",
  description:
    "Markdown Editor | Edit .MD Files With Live Preview | GitHub, GitLab & BitBucket Support | Export (HTML, PDF, Text) | Open Source",
  openGraph: {
    type: "website",
    siteName: "Markdown Editor",
    title: "Markdown Editor",
    description:
      "Edit .MD Files With Live Preview | GitHub, GitLab & BitBucket Support | Export (HTML, PDF, Text) | Open Source",
    url: "https://md.tristanbudd.com",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Markdown Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown Editor",
    description:
      "Edit .MD Files With Live Preview | GitHub, GitLab & BitBucket Support | Export (HTML, PDF, Text) | Open Source",
    images: ["/api/og"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  // Matches the app background colour in supported browsers
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9fb" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1b2e" },
  ],
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // suppressHydrationWarning prevents mismatches caused by next-themes injecting attributes on the client
    <html suppressHydrationWarning lang="en-GB">
      <head>
        {/* KaTeX CSS loaded from CDN to avoid bundling it */}
        <link
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${jetBrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider disableTransitionOnChange enableSystem attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
