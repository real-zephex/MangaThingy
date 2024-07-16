import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/navbar";

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
        <meta name="google-adsense-account" content="ca-pub-7424574858811768" />
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
        <Navbar />
        <div data-theme="dracula">{children}</div>
      </body>
    </html>
  );
}
