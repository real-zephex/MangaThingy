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
import { Input } from "@/components/ui/input";
import { Copy, Check, Heart, Bitcoin, Zap } from "lucide-react";
import { CRYPTO_ADDRESSES } from "@/lib/config/donations";

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DonationModal({ open, onOpenChange }: DonationModalProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = async (address: string, symbol: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(symbol);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" aria-hidden="true" />
            Support Otaku Oasis
          </DialogTitle>
          <DialogDescription>
            Your donations help keep this project running and free for everyone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {Object.values(CRYPTO_ADDRESSES).map((crypto) => (
            <div key={crypto.symbol} className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                {crypto.symbol === "BTC" ? (
                  <Bitcoin className="h-4 w-4 text-orange-500" />
                ) : (
                  <Zap className="h-4 w-4 text-purple-500" />
                )}
                <span>{crypto.name}</span>
                <span className="text-muted-foreground">({crypto.symbol})</span>
              </div>
              <div className="flex gap-2">
                <Input
                  value={crypto.address}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(crypto.address, crypto.symbol)}
                  aria-label={copiedAddress === crypto.symbol ? `${crypto.name} address copied` : `Copy ${crypto.name} address`}
                >
                  {copiedAddress === crypto.symbol ? (
                    <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Thank you for your support!
        </div>
      </DialogContent>
    </Dialog>
  );
}
