"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

/**
 * FooterLinks Component
 * 4-Kolom Footer terpadu persis dengan tampilan Modesy Marketplace
 */
export const FooterLinks: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setIsSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  const socialLinks = [
    {
      label: "Facebook",
      href: "https://facebook.com",
      svg: (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      label: "Twitter",
      href: "https://twitter.com",
      svg: (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: "https://instagram.com",
      svg: (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      label: "Pinterest",
      href: "https://pinterest.com",
      svg: (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com",
      svg: (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      href: "https://youtube.com",
      svg: (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      label: "VK",
      href: "https://vk.com",
      svg: (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.482 1.483 1.812 2.519 3.097 2.519h3.6c.997 0 1.442-.497 1.157-1.467-.614-2.091-3.398-4.996-3.486-5.467-.184-.977 1.83-2.673 2.923-4.425.641-1.026.233-1.635-.916-1.635h-3.791c-.714 0-1.028.384-1.272.977-1.121 2.724-2.584 5.115-3.666 4.908-.344-.066-.45-.487-.45-1.579V8.455c0-1.144-.334-1.46-1.246-1.46h-2.386c-.538 0-.847.288-.847.669 0 .852 1.272 1.05 1.399 3.447v3.298c0 .723-.131.854-.417.854-.761 0-2.616-2.738-3.72-5.864-.265-.747-.525-1.048-1.242-1.048H1.38c-.832 0-.999.384-.999.808 0 .753.963 4.502 4.484 9.429 2.348 3.328 5.65 5.143 8.297 5.143z" />
        </svg>
      ),
    },
    {
      label: "WhatsApp",
      href: "https://whatsapp.com",
      svg: (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.476-.15-.676.15-.2.3-.777.98-.952 1.18-.175.2-.351.225-.652.075-.301-.15-1.27-.468-2.42-1.494-.894-.797-1.498-1.782-1.674-2.082-.175-.3-.019-.462.131-.611.136-.134.301-.35.451-.525.15-.175.2-.3.301-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.927-2.235-.244-.589-.493-.51-.676-.52h-.576c-.2 0-.526.075-.802.375-.276.3-1.052 1.03-1.052 2.51 0 1.48 1.077 2.91 1.228 3.11.15.2 2.12 3.238 5.136 4.542.717.31 1.277.495 1.714.634.721.23 1.376.197 1.895.12.578-.087 1.78-.727 2.03-1.43.25-.702.25-1.303.175-1.43-.075-.125-.276-.2-.577-.35zm-5.462 7.508c-2.086 0-4.13-.561-5.917-1.624l-.424-.252-4.404 1.156 1.176-4.293-.277-.44c-1.168-1.859-1.785-4.004-1.785-6.207 0-6.556 5.333-11.89 11.891-11.89 3.177 0 6.164 1.238 8.412 3.486 2.247 2.248 3.483 5.235 3.483 8.414 0 6.558-5.334 11.89-11.895 11.89z" />
        </svg>
      ),
    },
    {
      label: "Telegram",
      href: "https://telegram.org",
      svg: (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.195 1.006.131.832.941z" />
        </svg>
      ),
    },
    {
      label: "RSS",
      href: "#rss",
      svg: (
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05 0 10.96 4.91 10.96 10.96h4.812c0-8.7-7.072-15.771-15.772-15.771zm0-8.18v4.813c10.563 0 19.139 8.575 19.139 19.138h4.812c0-13.22-10.732-23.951-23.951-23.951z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="border-t border-neutral-200 bg-white py-12 text-neutral-600 sm:py-16">
      <Container className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Kolom 1: Brand Info & Social Media */}
        <div>
          <Link href="/" className="flex items-center gap-1.5 text-2xl font-black tracking-tight text-neutral-900">
            <span>Modesy</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </Link>
          <p className="mt-3 text-xs leading-relaxed text-neutral-500">
            Modesy is a multi-vendor marketplace featuring verified sellers, unique crafted goods, modern fashion, and reliable worldwide delivery.
          </p>

          {/* Social Icons Row (10 icon lingkaran) */}
          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            {socialLinks.map((soc, idx) => (
              <a
                key={idx}
                href={soc.href}
                target="_blank"
                rel="noreferrer"
                aria-label={soc.label}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-500 transition hover:border-emerald-500 hover:bg-emerald-500 hover:text-white"
              >
                {soc.svg}
              </a>
            ))}
          </div>
        </div>

        {/* Kolom 2: Quick Links */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Quick Links
          </h5>
          <ul className="mt-4 space-y-2 text-xs text-neutral-500">
            <li><Link href="#pricing" className="transition hover:text-emerald-600">Pricing</Link></li>
            <li><Link href="#about" className="transition hover:text-emerald-600">About Us</Link></li>
            <li><Link href="#terms" className="transition hover:text-emerald-600">Terms of Use</Link></li>
            <li><Link href="#privacy" className="transition hover:text-emerald-600">Privacy Policy</Link></li>
            <li><Link href="/vendor" className="transition hover:text-emerald-600">Become a Vendor</Link></li>
            <li><Link href="#contact" className="transition hover:text-emerald-600">Contact Us</Link></li>
          </ul>
        </div>

        {/* Kolom 3: Information */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Information
          </h5>
          <ul className="mt-4 space-y-2 text-xs text-neutral-500">
            <li><Link href="#help" className="transition hover:text-emerald-600">Help Center / FAQ</Link></li>
            <li><Link href="#shipping" className="transition hover:text-emerald-600">Shipping & Delivery</Link></li>
            <li><Link href="#returns" className="transition hover:text-emerald-600">Returns & Exchanges</Link></li>
            <li><Link href="#refund" className="transition hover:text-emerald-600">Refund Policy</Link></li>
            <li><Link href="#sitemap" className="transition hover:text-emerald-600">Sitemap</Link></li>
          </ul>
        </div>

        {/* Kolom 4: Newsletter & Payment Badges */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Newsletter
          </h5>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500">
            Join our newsletter to receive news, updates, and special seasonal promotional deals.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="mt-3 flex flex-col gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              className="w-full rounded border border-neutral-300 bg-neutral-50 px-3 py-2 text-xs text-neutral-800 placeholder-neutral-400 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
            <button
              type="submit"
              className="w-full rounded bg-emerald-600 py-2 text-xs font-bold tracking-wide text-white uppercase shadow-xs transition hover:bg-emerald-700"
            >
              Subscribe
            </button>
            {isSubscribed && (
              <span className="text-[11px] text-emerald-600">
                ✓ Thank you for subscribing!
              </span>
            )}
          </form>

          {/* Payment Methods Badges */}
          <div className="mt-5 flex items-center gap-2">
            <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-bold text-neutral-700">
              VISA
            </span>
            <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-bold text-neutral-700">
              MasterCard
            </span>
            <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-bold text-neutral-700">
              Maestro
            </span>
            <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-bold text-neutral-700">
              AMEX
            </span>
            <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-bold text-neutral-700">
              PayPal
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
};
