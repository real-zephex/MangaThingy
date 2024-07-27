import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/ui/navbar";
import LoggedInWrapper from "@/utils/logged-in-wrapper";

const inter = Lexend_Deca({ subsets: ["latin"] });

const APP_NAME = "MangaThingy";
const APP_DEFAULT_TITLE = "MangaThingy";
const APP_TITLE_TEMPLATE = "%s - MangaThingy";
const APP_DESCRIPTION = "You can read mangas and watch animes ad-free!";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dim">
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
      </Head>
      <body className={inter.className}>
        <LoggedInWrapper>
          <Navbar />
          <div>{children}</div>
        </LoggedInWrapper>
      </body>
    </html>
  );
}
