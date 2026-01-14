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
import { TrackingProvider } from "@/providers/TrackingProvider";

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
  description: "Your ultimate destination for manga lovers. Explore, read, and enjoy a vast collection of manga titles all in one place.",

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
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="grow">
                      {children}
                    </main>
                    <Footer />
                  </div>
                </TrackingProvider>
              </ToastProvider>
            </ThemeProvider>
          </ClerkProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
