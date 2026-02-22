"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { DonationPopup } from "@/components/custom/donation/donation-popup";
import { DonationModal } from "@/components/custom/donation/donation-modal";

interface DonationContextType {
  openDonationModal: () => void;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export function DonationProvider({ children }: { children: ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);

  const openDonationModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  return (
    <DonationContext.Provider value={{ openDonationModal }}>
      {children}
      <DonationPopup onOpenDonationModal={openDonationModal} />
      <DonationModal open={modalOpen} onOpenChange={setModalOpen} />
    </DonationContext.Provider>
  );
}

export function useDonation() {
  const context = useContext(DonationContext);
  if (context === undefined) {
    throw new Error("useDonation must be used within a DonationProvider");
  }
  return context;
}
