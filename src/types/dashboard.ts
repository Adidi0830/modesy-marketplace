import type { ReactNode } from "react";

/**
 * @file Type definitions for the Admin Dashboard.
 * Centralizes all TypeScript interfaces used across dashboard components
 * to keep component files small and maintainable (<100 lines each).
 */

/** Product record from Supabase `products` table. */
export interface DashboardProduct {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  status: "active" | "pending";
}

/** Cart/Order item for latest sales table. */
export interface LatestSale {
  id: string;
  customerName: string;
  amount: number;
  paymentStatus: "paid" | "pending" | "failed";
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

/** Single review entry. */
export interface LatestReview {
  id: string;
  productName: string;
  rating: number;
  comment: string;
  authorName: string;
  authorAvatar: string;
  date: string;
}

/** Single comment entry. */
export interface LatestComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  date: string;
  productTitle?: string;
}

/** Summary metric card props. */
export interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changePositive?: boolean;
}

/** Navigation link for sidebar groups. */
export interface NavLink {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number | string;
}

/** Sidebar navigation group. */
export interface SidebarNavGroup {
  group: string;
  links: NavLink[];
}

/** Chart data point for monthly sales line. */
export interface MonthlySalesPoint {
  month: string;
  sales: number;
}

/** Donut segment value. */
export interface DonutValue {
  name: string;
  value: number;
  color: string;
}

const _exportFix = true;
export default _exportFix;
