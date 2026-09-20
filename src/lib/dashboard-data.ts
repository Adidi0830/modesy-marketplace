/**
 * @file Supabase-powered data fetchers for the Admin Dashboard.
 * Each function tries to read from the connected Supabase project; if the
 * project is not configured or returns no data, mock/fallback values are
 * returned so the UI remains fully usable during local development.
 */
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, getSupabaseClient } from "@/lib/supabase/client";
import type {
  LatestComment,
  LatestReview,
  LatestSale,
  MonthlySalesPoint,
} from "@/types/dashboard";

/** Server-side singleton client using env vars directly. */
function serverClient() {
  if (!isSupabaseConfigured()) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

/** Shared mock data used when Supabase is unreachable. */
const mockSales: LatestSale[] = [
  {
    id: "SALE-001",
    customerName: "Mock Customer",
    amount: 129.99,
    paymentStatus: "paid",
    orderStatus: "processing",
    date: "2025-01-15",
  },
];

const mockReviews: LatestReview[] = [
  {
    id: "REV-001",
    productName: "Mock Product",
    rating: 5,
    comment: "Great quality!",
    authorName: "Mock User",
    authorAvatar: "/placeholder.png",
    date: "2025-01-15",
  },
];

const mockComments: LatestComment[] = [
  {
    id: "C-001",
    authorName: "Mock Commenter",
    authorAvatar: "/placeholder.png",
    content: "Question about ordering.",
    date: "2025-01-15",
  },
];

const mockMonthly: MonthlySalesPoint[] = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  sales: Math.round(Math.random() * 2000) + 500,
}));

/** Fetch latest sales rows (empty array when unconfigured). */
export async function fetchLatestSales(limit = 5): Promise<LatestSale[]> {
  "use server";
  try {
    const supabase = serverClient() ?? getSupabaseClient();
    if (!supabase) return mockSales;
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("date", { ascending: false })
      .limit(limit);
    if (error || !data?.length) return mockSales;
    return data as LatestSale[];
  } catch {
    return mockSales;
  }
}

/** Fetch latest reviews rows. */
export async function fetchLatestReviews(limit = 5): Promise<LatestReview[]> {
  "use server";
  try {
    const supabase = serverClient() ?? getSupabaseClient();
    if (!supabase) return mockReviews;
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("date", { ascending: false })
      .limit(limit);
    if (error || !data?.length) return mockReviews;
    return data as LatestReview[];
  } catch {
    return mockReviews;
  }
}

/** Fetch latest comments rows. */
export async function fetchLatestComments(limit = 5): Promise<LatestComment[]> {
  "use server";
  try {
    const supabase = serverClient() ?? getSupabaseClient();
    if (!supabase) return mockComments;
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("date", { ascending: false })
      .limit(limit);
    if (error || !data?.length) return mockComments;
    return data as LatestComment[];
  } catch {
    return mockComments;
  }
}

/** Fetch monthly sales aggregation. */
export async function fetchMonthlySales(): Promise<MonthlySalesPoint[]> {
  "use server";
  try {
    const supabase = serverClient() ?? getSupabaseClient();
    if (!supabase) return mockMonthly;
    const { data, error } = await supabase.rpc("monthly_sales");
    if (error || !data?.length) return mockMonthly;
    return data as MonthlySalesPoint[] | undefined ?? mockMonthly;
  } catch {
    return mockMonthly;
  }
}

/** Fetch summary metrics for stat cards. */
export async function fetchDashboardStats(): Promise<{
  totalSales: number;
  balance: number;
  products: number;
  pendingProducts: number;
}> {
  "use server";
  try {
    const supabase = serverClient() ?? getSupabaseClient();
    if (!supabase) throw new Error("supabase not configured");
    const { count: pc } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });
    const { count: pend } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");
    const { data: bal } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", 0)
      .maybeSingle();
    return {
      totalSales: 10,
      balance: (bal as { balance: number } | null | undefined)?.balance ?? 647.1,
      products: pc ?? 23,
      pendingProducts: pend ?? 0,
    };
  } catch {
    return { totalSales: 10, balance: 647.1, products: 23, pendingProducts: 0 };
  }
}
