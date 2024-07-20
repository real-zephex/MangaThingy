"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UserLog } from "@/database/write";

const LoginDetect = () => {
  const { data: session, status } = useSession();
  const [displayStatus, setDisplayStatus] = useState(true);
  const [existing, setExisiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayStatus(false);
    }, 3000);

    // Cleanup the timer on component unmount
    LogUsers();
    return () => clearTimeout(timer);
  }, [status]);

  async function LogUsers() {
    if (status === "authenticated") {
      const message: boolean = await UserLog(
        session.user?.email!,
        session.user?.name!
      );
      setExisiting(message);
    }
  }

  return (
    <main className="z-50">
      {displayStatus && status === "authenticated" && (
        <div className="toast" id="toast">
          <div className="alert alert-info">
            <span>
              {existing
                ? `Welcome back ${session.user?.name}`
                : `Logged in as ${session.user?.name}`}
            </span>
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
