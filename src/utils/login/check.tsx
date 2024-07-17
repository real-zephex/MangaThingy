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
    >
      <div
        className="flex flex-row items-center justify-between"
        title="click to logout"
      >
        <Image
          src={status === "authenticated" ? session?.user?.image! : "/sign.jpg"}
          width={20}
          height={20}
          alt="Profile Picture"
          className="rounded-lg mr-4"
        />
        <p className="pl-2 ml-2">{session?.user?.name!}</p>
      </div>
    </button>
  );
};

export default LoginDetect;
