"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import { DONATION_CONFIG } from "@/lib/config/donations";

interface DonationPopupProps {
  onOpenDonationModal: () => void;
}

export function DonationPopup({ onOpenDonationModal }: DonationPopupProps) {
  const [showPopup, setShowPopup] = useState(() => {
    if (typeof window === "undefined") return false;
    
    const lastShown = localStorage.getItem(DONATION_CONFIG.storageKey);
    const now = Date.now();
    
    if (!lastShown || now - parseInt(lastShown, 10) >= DONATION_CONFIG.popupInterval) {
      localStorage.setItem(DONATION_CONFIG.storageKey, now.toString());
      return true;
    }
    return false;
  });

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleDonate = () => {
    handleClose();
    onOpenDonationModal();
  };

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Enjoying Otaku Oasis?
          </DialogTitle>
          <DialogDescription>
            Help us keep this project running! Your support means everything to us.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
                    <p className="text-sm text-muted-foreground text-center">
            We&apos;re a small team working hard to bring you the best manga reading experience.
            Any donation, no matter how small, helps us keep the lights on!
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={handleClose}>
            Maybe Later
          </Button>
          <Button
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            onClick={handleDonate}
          >
            <Heart className="h-4 w-4 mr-2" />
            Donate Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
