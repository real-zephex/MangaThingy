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
import { ScrollToTop } from "@/components/custom/ui/scroll-to-top";

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
        <script
          src="https://quge5.com/88/tag.min.js"
          data-zone="214492"
          async
          data-cfasync="false"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          <ClerkProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
            >
              <NextTopLoader color="var(--brand-start)" showSpinner={false} />

              <ToastProvider>
                <TrackingProvider>
                  <DonationProvider>
                    <div className="flex flex-col min-h-screen">
                      <a
                        href="#main-content"
                        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-brand-start focus:text-white focus:rounded-lg focus:font-bold focus:shadow-lg"
                      >
                        Skip to main content
                      </a>
                      <Navbar />
                      <main id="main-content" className="grow">{children}</main>
                      <ScrollToTop />
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
