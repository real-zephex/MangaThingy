"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const LoginDetect = () => {
  const { data: session, status } = useSession();
  const [displayStatus, setDisplayStatus] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayStatus(false);
    }, 3000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      {displayStatus && status === "authenticated" && (
        <div className="toast" id="toast">
          <div className="alert alert-info">
            <span>Logged in as {session.user?.name}</span>
          </div>
        </div>
      )}
      {displayStatus && status === "unauthenticated" && (
        <div className="toast">
          <div className="alert alert-info">
            <span>Not logged in or signed out.</span>
          </div>
        </div>
      )}
    </main>
  );
};

export default LoginDetect;
