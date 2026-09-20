"use client";

import React, { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Container } from "@/components/ui/Container";

/**
 * FooterNewsletter Component
 * Form langganan newsletter promo e-commerce Modesy
 */
export const FooterNewsletter: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Terima kasih! Email ${email} berhasil didaftarkan untuk promo.`);
      setEmail("");
    }
  };

  return (
    <div className="border-b border-neutral-800 bg-neutral-950 py-8 text-white">
      <Container className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-400">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-base font-bold sm:text-lg">Join Our Newsletter</h4>
            <p className="text-xs text-neutral-400">
              Get 15% off your first order and exclusive weekly deals.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubscribe}
          className="flex w-full max-w-md items-center rounded-lg bg-neutral-900 p-1 border border-neutral-800 focus-within:border-emerald-500"
        >
          <input
            type="email"
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none sm:text-sm"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
          >
            <span>Subscribe</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </Container>
    </div>
  );
};
