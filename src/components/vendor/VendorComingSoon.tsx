"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  LayoutDashboard,
  Package,
  PlusCircle,
  Bell,
  CheckCircle2,
  Clock,
  Layers,
  LucideIcon,
  ShoppingCart,
  Ticket,
  FileText,
  RotateCcw,
  CreditCard,
  MessageSquare,
  Star,
  Settings,
  Upload,
} from "lucide-react";

interface VendorComingSoonProps {
  pathSegments: string[];
}

const FEATURE_METADATA: Record<
  string,
  { title: string; description: string; category: string; icon: LucideIcon }
> = {
  sales: {
    title: "Sales & Orders",
    description: "Track customer purchases, fulfillment stages, and invoice generation in real-time.",
    category: "Sales",
    icon: ShoppingCart,
  },
  quotes: {
    title: "Quote Requests",
    description: "Receive, negotiate, and approve wholesale and custom product price inquiries.",
    category: "Sales",
    icon: FileText,
  },
  coupons: {
    title: "Coupons & Discounts",
    description: "Create promotional voucher codes, percentage discounts, and flash sales for your shop.",
    category: "Sales",
    icon: Ticket,
  },
  refunds: {
    title: "Refund Management",
    description: "Process customer return inquiries, approve item exchanges, and manage claim statuses.",
    category: "Sales",
    icon: RotateCcw,
  },
  cod: {
    title: "Cash on Delivery",
    description: "Manage pay-on-delivery shipments, driver receipts, and collected courier funds.",
    category: "Sales",
    icon: CreditCard,
  },
  payments: {
    title: "Payouts & Financials",
    description: "Connect your bank account, request instant earnings withdrawals, and download tax statements.",
    category: "Payments",
    icon: CreditCard,
  },
  comments: {
    title: "Customer Questions",
    description: "Directly communicate with potential customers inquiring about product specifications.",
    category: "Engagement",
    icon: MessageSquare,
  },
  reviews: {
    title: "Store Reviews & Ratings",
    description: "Analyze buyer feedback, maintain high vendor badges, and respond to customer reviews.",
    category: "Engagement",
    icon: Star,
  },
  settings: {
    title: "Store & Shipping Settings",
    description: "Configure store branding, operational hours, return policies, and carrier shipping zones.",
    category: "Settings",
    icon: Settings,
  },
  bulk: {
    title: "Bulk Product Upload",
    description: "Upload and update hundreds of product SKUs simultaneously using Excel or CSV templates.",
    category: "Products",
    icon: Upload,
  },
  drafts: {
    title: "Product Drafts",
    description: "Save incomplete product listings and publish them whenever you're ready.",
    category: "Products",
    icon: Layers,
  },
};

export const VendorComingSoon: React.FC<VendorComingSoonProps> = ({ pathSegments }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const mainSlug = pathSegments[0] || "feature";
  const subSlug = pathSegments[1] || "";
  
  const key = subSlug && FEATURE_METADATA[subSlug] ? subSlug : (FEATURE_METADATA[mainSlug] ? mainSlug : "");
  
  const meta = key ? FEATURE_METADATA[key] : null;

  const title = meta?.title || pathSegments.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" > ");
  const description =
    meta?.description ||
    "This vendor feature is currently in active development to give you full control over your marketplace operations.";
  const category = meta?.category || "Vendor Tools";
  const IconComponent = meta?.icon || Sparkles;

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/vendor" className="hover:text-emerald-600 transition">
            Vendor Dashboard
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{title}</span>
        </div>
        <Link
          href="/vendor"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-emerald-600 hover:text-emerald-600 transition"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      {/* Main Coming Soon Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 p-8 shadow-sm lg:p-12">
        {/* Background glow accents */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-2xl text-center">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-semibold text-emerald-700 backdrop-blur-xs">
            <Clock size={13} className="animate-pulse" />
            <span>{category} &bull; Feature Coming Soon</span>
          </div>

          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/20">
            <IconComponent size={36} />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            {title}
          </h1>

          {/* Description */}
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {description}
          </p>

          {/* Development Status Indicator */}
          <div className="my-8 rounded-xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-600" />
                Feature Status
              </span>
              <span className="text-emerald-700">In Active Development</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600" />
            </div>
            <p className="mt-2.5 text-left text-xs text-slate-400">
              We are finalizing the backend APIs and UI widgets to ensure a seamless vendor experience.
            </p>
          </div>

          {/* Notification Form */}
          {!subscribed ? (
            <form onSubmit={handleNotify} className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for release updates"
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
              >
                <Bell size={14} /> Notify Me
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-800">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Thank you! We will notify you as soon as this feature launches.
            </div>
          )}

          {/* Quick Available Links */}
          <div className="mt-10 border-t border-slate-100 pt-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Available Vendor Tools
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/vendor"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs hover:border-emerald-600 hover:text-emerald-600 transition"
              >
                <LayoutDashboard size={14} /> Dashboard Overview
              </Link>
              <Link
                href="/vendor/products"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs hover:border-emerald-600 hover:text-emerald-600 transition"
              >
                <Package size={14} /> Product Catalog
              </Link>
              <Link
                href="/vendor/products/add"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
              >
                <PlusCircle size={14} /> Add New Product
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
