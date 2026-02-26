import Footer from "@/components/custom/footer";
import Navbar from "@/components/custom/navbar";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ThemeProvider } from "@/components/themeProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/ClerkClientProvider";
import { DonationProvider } from "@/providers/DonationProvider";
import { TrackingProvider } from "@/providers/TrackingProvider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Otaku Oasis",
    default: "Otaku Oasis",
  },
  description:
    "Your ultimate destination for manga lovers. Explore, read, and enjoy a vast collection of manga titles all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics gaId="G-WSQFR03XW0" />
        <Script
          src="https://quge5.com/88/tag.min.js"
          data-zone="214492"
          async
          data-cfasync="false"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          <ClerkProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NextTopLoader color="blue" showSpinner={false} />

              <ToastProvider>
                <TrackingProvider>
                  <DonationProvider>
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <main className="grow">{children}</main>
                      <Footer />
                    </div>
                  </DonationProvider>
                </TrackingProvider>
              </ToastProvider>
            </ThemeProvider>
          </ClerkProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
