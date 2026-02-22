"use client";

import { Heart } from "lucide-react";
import { useDonation } from "@/providers/DonationProvider";

export function DonateLink() {
  const { openDonationModal } = useDonation();

  return (
    <button
      onClick={openDonationModal}
      className="hover:underline underline-offset-4 flex items-center gap-1"
    >
      <Heart className="h-3 w-3" />
      Donate
    </button>
  );
}
