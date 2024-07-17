"use client";

import { SessionProvider } from "next-auth/react";

const LoggedInWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default LoggedInWrapper;
