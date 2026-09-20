/**
 * @file Static navigation configuration for the Admin Sidebar.
 * Centralizes route metadata (label, href, icon, badge) so the sidebar stays
 * declarative and under 100 lines.
 */
import {
  LayoutDashboard,
  Package,
  Upload,
  ShoppingCart,
  FileText,
  Tag,
  Undo2,
  Banknote,
  CreditCard,
  MessageCircle,
  Star,
  Settings,
  Truck,
  Shield,
} from "lucide-react";
import type { SidebarNavGroup } from "@/types/dashboard";

/** Sidebar navigation groups and links. */
export const navGroups: SidebarNavGroup[] = [
  {
    group: "NAVIGATION",
    links: [
      { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
    ],
  },
  {
    group: "PRODUCTS",
    links: [
      { label: "Add Product", href: "/admin/products/add", icon: <Package size={18} /> },
      { label: "Bulk Upload", href: "/admin/products/bulk", icon: <Upload size={18} /> },
      { label: "Products", href: "/admin/products", icon: <ShoppingCart size={18} /> },
    ],
  },
  {
    group: "SALES",
    links: [
      { label: "Sales", href: "/admin/sales", icon: <FileText size={18} /> },
      { label: "Quote Requests", href: "/admin/quotes", icon: <Tag size={18} /> },
      { label: "Coupons", href: "/admin/coupons", icon: <Tag size={18} /> },
      { label: "Refund Requests", href: "/admin/refunds", icon: <Undo2 size={18} />, badge: 3 },
      { label: "Cash on Delivery", href: "/admin/cod", icon: <Banknote size={18} /> },
    ],
  },
  {
    group: "PAYMENTS",
    links: [
      { label: "Payments", href: "/admin/payments", icon: <CreditCard size={18} /> },
    ],
  },
  {
    group: "COMMENTS",
    links: [
      { label: "Comments", href: "/admin/comments", icon: <MessageCircle size={18} /> },
      { label: "Reviews", href: "/admin/reviews", icon: <Star size={18} /> },
    ],
  },
  {
    group: "SETTINGS",
    links: [
      { label: "Shop Settings", href: "/admin/settings/shop", icon: <Settings size={18} /> },
      { label: "Shop Policies", href: "/admin/settings/policies", icon: <Shield size={18} /> },
      { label: "Shipping Settings", href: "/admin/settings/shipping", icon: <Truck size={18} /> },
    ],
  },
];
