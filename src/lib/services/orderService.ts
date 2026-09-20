import { OrderRecord } from "@/types";
import { getSupabaseClient } from "@/lib/supabase/client";
import { getSupabaseAdmin } from "@/lib/supabase/server";

function getClient() {
  return getSupabaseAdmin() || getSupabaseClient();
}

export function formatOrderNumber(id: string, index?: number): string {
  if (!id) return `#1000${(index ?? 0) + 1}`;
  if (id.startsWith("mock-")) {
    const num = id.replace("mock-", "");
    return `#100${num.padStart(2, "0")}`;
  }
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 90;
  }
  const cleanNum = 10 + Math.abs(hash);
  return `#100${cleanNum}`;
}

export const MOCK_ORDERS: OrderRecord[] = [
  {
    id: "mock-24",
    order_number: "#10024",
    user_id: "54c6c0de-6046-4bc0-a38b-be4d5b9e7ecc", // Peter Jone
    status: "pending",
    total: 67.75,
    shipping_name: "Peter Jone",
    created_at: "2026-09-14T16:27:00Z",
    payment_method: "cod",
  },
  {
    id: "mock-23",
    order_number: "#10023",
    user_id: "54c6c0de-6046-4bc0-a38b-be4d5b9e7ecc", // Peter Jone
    status: "pending",
    total: 71.95,
    shipping_name: "Peter Jone",
    created_at: "2026-09-14T16:20:00Z",
    payment_method: "cod",
  },
  {
    id: "mock-22",
    order_number: "#10022",
    user_id: "54c6c0de-6046-4bc0-a38b-be4d5b9e7ecc", // Peter Jone
    status: "pending",
    total: 244.60,
    shipping_name: "Peter Jone",
    created_at: "2026-09-14T16:08:00Z",
    payment_method: "cod",
  },
  {
    id: "mock-20",
    order_number: "#10020",
    user_id: "54c6c0de-6046-4bc0-a38b-be4d5b9e7ecc", // Peter Jone
    status: "pending",
    total: 271.30,
    shipping_name: "Peter Jone",
    created_at: "2026-09-11T09:26:00Z",
    payment_method: "cod",
  },
  {
    id: "mock-07",
    order_number: "#10007",
    user_id: "54c6c0de-6046-4bc0-a38b-be4d5b9e7ecc", // Peter Jone
    status: "completed",
    total: 32.86,
    shipping_name: "Peter Jone",
    created_at: "2026-08-05T13:50:00Z",
    payment_method: "cod",
  },
];

export async function getUserOrders(userId?: string): Promise<OrderRecord[]> {
  const supabase = getClient();
  if (!supabase) {
    if (!userId) return [];
    return MOCK_ORDERS.filter((o) => o.user_id === userId);
  }

  try {
    let query = supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("Supabase query error in getUserOrders:", error);
      if (userId) {
        return MOCK_ORDERS.filter((o) => o.user_id === userId);
      }
      return [];
    }

    if (!data || data.length === 0) {
      if (userId) {
        return MOCK_ORDERS.filter((o) => o.user_id === userId);
      }
      return [];
    }

    return data.map((o: any, idx: number) => ({
      id: o.id,
      order_number: formatOrderNumber(o.id, idx),
      user_id: o.user_id,
      status: o.status || "pending",
      total: Number(o.total || 0),
      shipping_name: o.shipping_name || "Customer",
      shipping_phone: o.shipping_phone,
      shipping_address: o.shipping_address,
      payment_method: o.payment_method || "cod",
      created_at: o.created_at,
      items: o.order_items || [],
    }));
  } catch (err) {
    console.warn("Error fetching user orders from Supabase:", err);
    if (userId) {
      return MOCK_ORDERS.filter((o) => o.user_id === userId);
    }
    return [];
  }
}
