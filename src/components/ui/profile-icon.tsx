"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

const ProfileIcon = () => {
  const { data: session, status } = useSession();

  return (
    <main className="ml-1">
      {session && (
        <div
          className="avatar hover:cursor-pointer"
          onClick={() => {
            const modal = document.getElementById(
              "my_modal_3"
            ) as HTMLDialogElement | null;
            if (modal) {
              modal.showModal();
            }
          }}
        >
          <div className="ring-secondary ring-offset-base-100 rounded-full ring ring-offset-2">
            <Image
              src={session.user?.image!}
              alt="profile"
              width={30}
              height={30}
              
              className="rounded-full"
            />
          </div>
        </div>
      )}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex flex-col items-center justify-center">
            <div className="avatar">
              <div className="w-24 rounded-full">
                <Image
                  src={session?.user?.image!}
                  alt="profile"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center pt-2">
              <p className="font-bold text-lg">{session?.user?.name}</p>
              <p className="text-gray-500">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </dialog>
    </main>
  );
};

export default ProfileIcon;
