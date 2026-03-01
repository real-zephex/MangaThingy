"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface ShareButtonProps {
  title: string;
}

export const ShareButton = ({ title }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if ((error as DOMException).name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <Button
      variant="outline"
      size="default"
      className="rounded-lg border-border/50 font-semibold gap-2 hover:border-brand-start hover:text-brand-start transition-colors"
      onClick={handleShare}
      aria-label="Share this manga"
    >
      {copied ? (
        <Check size={16} aria-hidden="true" />
      ) : (
        <Share2 size={16} aria-hidden="true" />
      )}
      {copied ? "Copied!" : "Share"}
    </Button>
  );
};
