"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

const LoginButton = () => {
  const { data: session, status } = useSession();

  const [enable, setEnable] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setEnable(true);
    } else {
      setEnable(false);
    }
  });

  return (
    <Link href={enable ? "/api/auth/signout" : "/api/auth/signin"}>
      <button className="btn w-full">
        {enable ? "Click to logout" : "Log in"}
      </button>
    </Link>
  );
};

export default LoginButton;
