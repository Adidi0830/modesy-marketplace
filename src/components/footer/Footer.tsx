import React from "react";
import { FooterLinks } from "./FooterLinks";
import { FooterBottom } from "./FooterBottom";

/**
 * Footer Component
 * Footer utama Modesy Marketplace sesuai desain referensi
 */
export const Footer: React.FC = () => {
  return (
    <footer className="mt-10 w-full">
      <FooterLinks />
      <FooterBottom />
    </footer>
  );
};
