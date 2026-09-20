"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Upload,
  Package,
  ShoppingCart,
  FileText,
  Ticket,
  RotateCcw,
  Banknote,
  CreditCard,
  MessageSquare,
  Star,
  Settings,
  ShieldCheck,
  Truck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const teal = "#00C9A7";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  children?: { label: string; href: string }[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "NAVIGATION",
    items: [
      {
        label: "Dashboard",
        href: "/vendor",
        icon: <LayoutDashboard size={17} />,
      },
    ],
  },
  {
    title: "PRODUCTS",
    items: [
      {
        label: "Add Product",
        href: "/vendor/products/add",
        icon: <PlusCircle size={17} />,
      },
      {
        label: "Bulk Product Upload",
        href: "/vendor/products/bulk",
        icon: <Upload size={17} />,
      },
      {
        label: "Products",
        href: "/vendor/products",
        icon: <Package size={17} />,
        children: [
          { label: "All Products", href: "/vendor/products" },
          { label: "Drafts", href: "/vendor/products/drafts" },
        ],
      },
    ],
  },
  {
    title: "SALES",
    items: [
      {
        label: "Sales",
        href: "/vendor/sales",
        icon: <ShoppingCart size={17} />,
        children: [
          { label: "All Sales", href: "/vendor/sales" },
          { label: "Processing", href: "/vendor/sales/processing" },
        ],
      },
      {
        label: "Quote Requests",
        href: "/vendor/quotes",
        icon: <FileText size={17} />,
        badge: 1,
      },
      {
        label: "Coupons",
        href: "/vendor/coupons",
        icon: <Ticket size={17} />,
      },
      {
        label: "Refund Requests",
        href: "/vendor/refunds",
        icon: <RotateCcw size={17} />,
        badge: 2,
      },
      {
        label: "Cash on Delivery",
        href: "/vendor/cod",
        icon: <Banknote size={17} />,
      },
    ],
  },
  {
    title: "PAYMENTS",
    items: [
      {
        label: "Payments",
        href: "/vendor/payments",
        icon: <CreditCard size={17} />,
        children: [
          { label: "Payouts", href: "/vendor/payments/payouts" },
          { label: "Transactions", href: "/vendor/payments/transactions" },
        ],
      },
    ],
  },
  {
    title: "COMMENTS",
    items: [
      {
        label: "Comments",
        href: "/vendor/comments",
        icon: <MessageSquare size={17} />,
      },
      {
        label: "Reviews",
        href: "/vendor/reviews",
        icon: <Star size={17} />,
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      {
        label: "Shop Settings",
        href: "/vendor/settings/shop",
        icon: <Settings size={17} />,
      },
      {
        label: "Shop Policies",
        href: "/vendor/settings/policies",
        icon: <ShieldCheck size={17} />,
      },
      {
        label: "Shipping Settings",
        href: "/vendor/settings/shipping",
        icon: <Truck size={17} />,
      },
    ],
  },
];

export default function VendorSidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Sales: true,
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      {/* Top Header Logo */}
      <div className="flex items-center justify-center py-6">
        <Link href="/vendor" className="text-2xl font-bold tracking-tight text-slate-800" style={{ fontFamily: "Georgia, serif" }}>
          Modesy
        </Link>
      </div>

      {/* Centered Vendor Profile */}
      <div className="flex flex-col items-center justify-center pb-5 pt-1">
        <div className="relative h-18 w-18 overflow-hidden rounded-full border-2 border-amber-300 shadow-xs">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
            alt="Trendshop"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200";
            }}
          />
        </div>
        <p className="mt-3 text-sm font-bold text-slate-800">Hi, Trendshop</p>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 pb-8">
        {navGroups.map((group) => {
          return (
            <div key={group.title} className="mb-4">
              <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <NavLinkItem
                      item={item}
                      currentPath={pathname}
                      isOpen={openGroups[item.label] ?? false}
                      onToggle={() => toggleGroup(item.label)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function NavLinkItem({
  item,
  currentPath,
  isOpen,
  onToggle,
}: {
  item: NavItem;
  currentPath: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const hasChildren = !!item.children?.length;
  
  const isExactActive = currentPath === item.href;
  const isSubActive = item.children?.some((child) => currentPath === child.href) ?? false;
  const isParentActive =
    item.href !== "/vendor" && currentPath.startsWith(item.href) && !isExactActive;
  const isActive = isExactActive || isSubActive || isParentActive;

  return (
    <div>
      <div className="relative flex items-center">
        <Link
          href={item.href}
          className={`group flex flex-1 items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            isActive
              ? "bg-slate-100/90 text-slate-900"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <span className={`transition-colors ${isActive ? "text-slate-800" : "text-slate-500 group-hover:text-slate-800"}`}>
              {item.icon}
            </span>
            <span className="text-[13px]">{item.label}</span>
          </span>
          <span className="flex items-center gap-1.5">
            {item.badge ? (
              <span
                className="flex h-5 min-w-[20px] items-center justify-center rounded-md px-1.5 text-[11px] font-bold text-white shadow-2xs"
                style={{ backgroundColor: teal }}
              >
                {item.badge}
              </span>
            ) : null}
            {hasChildren && (
              <span
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggle();
                }}
                className="p-0.5 text-slate-400 hover:text-slate-700"
              >
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
            )}
          </span>
        </Link>
      </div>
      {hasChildren && isOpen && (
        <ul className="ml-7 mt-0.5 space-y-0.5 border-l border-slate-200 pl-2">
          {item.children!.map((child) => {
            const isChildActive = currentPath === child.href;
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className={`block rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    isChildActive
                      ? "bg-slate-100 font-semibold text-slate-900"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
