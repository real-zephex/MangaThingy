import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import LoggedInWrapper from "@/components/data/logged-in-wrapper";

const inter = Lexend_Deca({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MangaThingy",
  description: "You can read mangas here!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dracula">
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WSQFR03XW0"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					
					gtag('config', 'G-WSQFR03XW0');
					`,
          }}
        ></script>
      </head>
      <body className={inter.className}>
        <div data-theme="dracula">
          <LoggedInWrapper>
            <Navbar />
            {children}
          </LoggedInWrapper>
        </div>
      </body>
    </html>
  );
}
