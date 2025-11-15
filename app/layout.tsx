import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/providers/convexProviderWithClerk'
import SWRProvider from '@/providers/swr-provider'
import { Toaster } from '@/components/ui/toaster'
import { constructMetadata, organizationSchema, websiteSchema } from '@/lib/seo'

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["monospace"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#7C2D32',
}

export const metadata: Metadata = {
  ...constructMetadata({
    title: "ConnectCom - Uganda's Premier Online Marketplace",
    description: "Discover and shop from Uganda's best local businesses, products, and services. Connect with trusted vendors across Kampala and beyond.",
  }),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ConnectCom',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="ConnectCom" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ConnectCom" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#7C2D32" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#7C2D32" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <ClerkProvider>
          <ConvexClientProvider>
            <SWRProvider>
              {children}
              <Toaster />
            </SWRProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
