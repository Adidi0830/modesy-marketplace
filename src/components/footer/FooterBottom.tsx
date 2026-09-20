import React from "react";
import { Container } from "@/components/ui/Container";

/**
 * FooterBottom Component
 * Baris copyright Modesy
 */
export const FooterBottom: React.FC = () => {
  return (
    <div className="border-t border-neutral-200 bg-neutral-50 py-4 text-xs text-neutral-500">
      <Container className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <p className="text-center sm:text-left text-neutral-500">
          Copyright 2026 Modesy - All Rights Reserved.
        </p>
        <div className="flex items-center gap-4 text-xs text-neutral-500">
          <a href="#terms" className="hover:text-emerald-600">Terms of Use</a>
          <span>·</span>
          <a href="#privacy" className="hover:text-emerald-600">Privacy Policy</a>
          <span>·</span>
          <a href="#sitemap" className="hover:text-emerald-600">Sitemap</a>
        </div>
      </Container>
    </div>
  );
};
