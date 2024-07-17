"use client";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";

const LoginDetect = () => {
  const { data: session, status } = useSession();

  return (
    <button
      className="btn btn-outline btn-primary"
      onClick={() => (status === "authenticated" ? signOut() : signIn())}
      title={
        status === "authenticated" ? "click to log out" : "click to log in"
      }
    >
      <div className="flex flex-row items-center">
        <Image
          src={status === "authenticated" ? session?.user?.image! : "/sign.jpg"}
          width={50}
          height={50}
          alt="Profile Picture"
          className="rounded-lg"
        />
        <p>{session?.user?.name!}</p>
      </div>
    </button>
  );
};

export default LoginDetect;
