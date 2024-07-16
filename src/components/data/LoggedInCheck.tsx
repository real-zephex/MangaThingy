// LoggedInCheck.js
"use client";

import { useSession, SessionProvider } from "next-auth/react";

const Logged = () => {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return <p>{session.user?.name}</p>;
  }

  return <p>Not found</p>;
};

export default Logged;
