import { getSupabaseAdmin } from "@/lib/supabase/server";
import type {
  VendorDashboardData,
  VendorStats,
  VendorDonutSegment,
  MonthlySalesPoint,
  VendorComment,
  VendorReview,
  VendorSale,
} from "@/types/vendor-dashboard";

export const MOCK_VENDOR_SALES: VendorSale[] = [
  {
    id: "#10026",
    orderNumber: "10026",
    total: 11,
    status: "Processing",
    paymentStatus: "Pending Payment",
    paymentMethod: "Bank Transfer",
    date: "2026-09-17 / 18:28",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@example.com",
    customerPhone: "+1 (555) 234-5678",
    shippingAddress: "742 Evergreen Terrace, Springfield, OR 97477",
    shippingMethod: "Standard Shipping (3-5 days)",
    items: [
      {
        id: "item-10026-1",
        name: "Minimalist Linen Tote Bag",
        sku: "BAG-LIN-001",
        price: 11,
        quantity: 1,
        total: 11,
        imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400",
      },
    ],
  },
  {
    id: "#10022",
    orderNumber: "10022",
    total: 218.9,
    status: "Processing",
    paymentStatus: "Pending Payment",
    paymentMethod: "Cash on Delivery",
    date: "2026-09-14 / 16:08",
    customerName: "Peter Jone",
    customerEmail: "peter.jone@example.com",
    customerPhone: "+1 (555) 432-8765",
    shippingAddress: "123 Market St, Suite 400, San Francisco, CA 94103",
    shippingMethod: "Express Courier",
    items: [
      {
        id: "item-10022-1",
        name: "Classic Leather Watch Brown",
        sku: "WTC-LTH-BRN",
        price: 149.0,
        quantity: 1,
        total: 149.0,
        imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400",
      },
      {
        id: "item-10022-2",
        name: "Vintage Sunglasses Polarized",
        sku: "GLS-VNT-002",
        price: 69.9,
        quantity: 1,
        total: 69.9,
        imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
      },
    ],
  },
  {
    id: "#10020",
    orderNumber: "10020",
    total: 194.7,
    status: "Processing",
    paymentStatus: "Pending Payment",
    paymentMethod: "Credit Card (Stripe)",
    date: "2026-09-11 / 09:26",
    customerName: "Michael Chen",
    customerEmail: "m.chen@example.com",
    customerPhone: "+1 (555) 789-0123",
    shippingAddress: "456 Pine Ave, Seattle, WA 98101",
    shippingMethod: "Standard Shipping",
    items: [
      {
        id: "item-10020-1",
        name: "Wireless Noise-Cancelling Headphones",
        sku: "AUD-WNC-BLK",
        price: 194.7,
        quantity: 1,
        total: 194.7,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      },
    ],
  },
  {
    id: "#10019",
    orderNumber: "10019",
    total: 174.4,
    status: "Processing",
    paymentStatus: "Payment Received",
    paymentMethod: "Midtrans / QRIS",
    date: "2026-09-09 / 11:39",
    customerName: "Elena Rostova",
    customerEmail: "elena.r@example.com",
    customerPhone: "+1 (555) 345-6789",
    shippingAddress: "89 Ocean Drive, Miami, FL 33139",
    shippingMethod: "Express Shipping",
    items: [
      {
        id: "item-10019-1",
        name: "Ceramic Artisan Coffee Mug Set",
        sku: "HM-CRM-MUG",
        price: 58.0,
        quantity: 2,
        total: 116.0,
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400",
      },
      {
        id: "item-10019-2",
        name: "Organic Coffee Beans 1kg",
        sku: "FD-CF-1KG",
        price: 58.4,
        quantity: 1,
        total: 58.4,
        imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
      },
    ],
  },
  {
    id: "#10018",
    orderNumber: "10018",
    total: 143,
    status: "Processing",
    paymentStatus: "Payment Received",
    paymentMethod: "PayPal",
    date: "2026-09-09 / 05:59",
    customerName: "David Miller",
    customerEmail: "david.m@example.com",
    customerPhone: "+1 (555) 901-2345",
    shippingAddress: "12 Riverside Blvd, Austin, TX 78701",
    shippingMethod: "Standard Shipping",
    items: [
      {
        id: "item-10018-1",
        name: "Ergonomic Desk Mat Leather",
        sku: "OFF-MAT-LTH",
        price: 45.0,
        quantity: 1,
        total: 45.0,
        imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
      },
      {
        id: "item-10018-2",
        name: "Mechanical Keyboard Wireless",
        sku: "TECH-KB-RGB",
        price: 98.0,
        quantity: 1,
        total: 98.0,
        imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
      },
    ],
  },
  {
    id: "#10014",
    orderNumber: "10014",
    total: 822.9,
    status: "Processing",
    paymentStatus: "Pending Payment",
    paymentMethod: "Bank Wire",
    date: "2026-09-04 / 08:31",
    customerName: "Amanda Walker",
    customerEmail: "amanda.w@example.com",
    customerPhone: "+1 (555) 678-9012",
    shippingAddress: "350 5th Ave, New York, NY 10118",
    shippingMethod: "White Glove Freight",
    items: [
      {
        id: "item-10014-1",
        name: "Mid-Century Modern Velvet Armchair",
        sku: "FRN-VLV-CHR",
        price: 750.0,
        quantity: 1,
        total: 750.0,
        imageUrl: "https://images.unsplash.com/photo-1580481077197-09d6f345ecb3?w=400",
      },
      {
        id: "item-10014-2",
        name: "Decorative Cushion Mustard Yellow",
        sku: "HM-DEC-CSH",
        price: 72.9,
        quantity: 1,
        total: 72.9,
        imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400",
      },
    ],
  },
  {
    id: "#10013",
    orderNumber: "10013",
    total: 69.9,
    status: "Processing",
    paymentStatus: "Pending Payment",
    paymentMethod: "Credit Card",
    date: "2026-09-03 / 13:21",
    customerName: "Lucas Vance",
    customerEmail: "lucas.v@example.com",
    customerPhone: "+1 (555) 456-7890",
    shippingAddress: "77 Sunset Strip, Los Angeles, CA 90069",
    shippingMethod: "Standard Shipping",
    items: [
      {
        id: "item-10013-1",
        name: "Summer Fashion Top Lace",
        sku: "CLO-SUM-TOP",
        price: 69.9,
        quantity: 1,
        total: 69.9,
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
      },
    ],
  },
  {
    id: "#10012",
    orderNumber: "10012",
    total: 91.9,
    status: "Processing",
    paymentStatus: "Pending Payment",
    paymentMethod: "Cash on Delivery",
    date: "2026-09-01 / 03:31",
    customerName: "Sophia Martinez",
    customerEmail: "sophia.m@example.com",
    customerPhone: "+1 (555) 321-6549",
    shippingAddress: "100 Beacon St, Boston, MA 02116",
    shippingMethod: "Standard Shipping",
    items: [
      {
        id: "item-10012-1",
        name: "Animal Colorful Digital Prints Frame",
        sku: "ART-ANM-PRT",
        price: 91.9,
        quantity: 1,
        total: 91.9,
        imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400",
      },
    ],
  },
  {
    id: "#10010",
    orderNumber: "10010",
    total: 156.8,
    status: "Processing",
    paymentStatus: "Payment Received",
    paymentMethod: "Credit Card (Stripe)",
    date: "2026-08-31 / 17:37",
    customerName: "Robert Taylor",
    customerEmail: "robert.t@example.com",
    customerPhone: "+1 (555) 765-4321",
    shippingAddress: "221B Baker Street, Chicago, IL 60601",
    shippingMethod: "Express Courier",
    items: [
      {
        id: "item-10010-1",
        name: "Handcrafted Ceramic Vase",
        sku: "HM-CRM-VAS",
        price: 86.8,
        quantity: 1,
        total: 86.8,
        imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400",
      },
      {
        id: "item-10010-2",
        name: "Scented Soy Candle 3-Pack",
        sku: "HM-CDL-SOY",
        price: 70.0,
        quantity: 1,
        total: 70.0,
        imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400",
      },
    ],
  },
];

const mockDashboardData: VendorDashboardData = {
  vendor: {
    name: "Trendshop",
    storeName: "Trendshop Store",
    avatarUrl: null,
  },
  stats: {
    totalSales: 15,
    balance: 1009.48,
    products: 24,
    pendingProducts: 0,
  },
  salesBreakdown: [
    { name: "Active Sales", value: 7, color: "#00C9A7" },
    { name: "Completed Sales", value: 8, color: "#6C5CE7" },
  ],
  monthlySales: [
    { month: "Jan", sales: 320 },
    { month: "Feb", sales: 480 },
    { month: "Mar", sales: 610 },
    { month: "Apr", sales: 540 },
    { month: "May", sales: 720 },
    { month: "Jun", sales: 890 },
    { month: "Jul", sales: 1050 },
    { month: "Aug", sales: 1200 },
    { month: "Sep", sales: 1450 },
    { month: "Oct", sales: 980 },
    { month: "Nov", sales: 760 },
    { month: "Dec", sales: 540 },
  ],
  comments: [],
  reviews: [
    { id: "4", comment: "Test 1", product: "Animal colorful digital prints", date: "2026-09-03 / 22:40", rating: 4 },
    { id: "7", comment: "The summer fashion lace...", product: "Summer fashion top lace", date: "2026-08-05 / 14:04", rating: 4 },
  ],
  sales: MOCK_VENDOR_SALES.slice(0, 5),
};

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return Boolean(url && anonKey && url !== "https://your-project.supabase.co");
}

export async function getVendorSalesList(): Promise<VendorSale[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_VENDOR_SALES;
  }

  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return MOCK_VENDOR_SALES;

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error || !orders || orders.length === 0) {
      return MOCK_VENDOR_SALES;
    }

    const seenNumbers = new Set<string>();
    const dbSales: VendorSale[] = orders.map((o: any, idx: number) => {
      let orderNum = o.order_number
        ? (o.order_number.startsWith("#") ? o.order_number : `#${o.order_number}`)
        : (o.id ? (o.id.startsWith("#") ? o.id : `#${o.id.slice(0, 8)}`) : `#100${80 + idx}`);
      
      // If orderNum already exists in this batch, ensure uniqueness with idx
      if (seenNumbers.has(orderNum)) {
        orderNum = `${orderNum}-${idx + 1}`;
      }
      seenNumbers.add(orderNum);
      
      const rawStatus = (o.status || "").toLowerCase();
      const status: "Processing" | "Completed" | "Cancelled" =
        rawStatus === "completed" ? "Completed" : rawStatus === "cancelled" ? "Cancelled" : "Processing";

      const rawPaymentStatus = (o.payment_status || "").toLowerCase();
      const paymentStatus: "Pending Payment" | "Payment Received" =
        rawPaymentStatus === "received" || rawPaymentStatus === "paid" || rawPaymentStatus === "payment received"
          ? "Payment Received"
          : "Pending Payment";

      const formattedDate = o.created_at
        ? new Date(o.created_at).toISOString().slice(0, 16).replace("T", " / ")
        : "2026-09-18 / 12:00";

      return {
        id: orderNum,
        orderNumber: orderNum.replace("#", ""),
        total: Number(o.total || 0),
        status,
        paymentStatus,
        paymentMethod: o.payment_method === "cod" ? "Cash on Delivery" : (o.payment_method || "Online Payment"),
        date: formattedDate,
        customerName: o.shipping_name || "Customer",
        customerEmail: o.customer_email || "customer@example.com",
        customerPhone: o.shipping_phone || "+1 (555) 000-0000",
        shippingAddress: o.shipping_address || "Standard Address",
        shippingMethod: o.shipping_method || "Standard Delivery",
        items: (o.order_items || []).map((item: any, iIdx: number) => ({
          id: item.id || `item-${idx}-${iIdx}`,
          name: item.product_name || "Product Item",
          sku: item.sku || "SKU-001",
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 1),
          total: Number(item.price || 0) * Number(item.quantity || 1),
          imageUrl: item.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        })),
      };
    });

    // Merge database orders with baseline mock sales (avoiding duplicates)
    const existingIds = new Set(dbSales.map((s) => s.id));
    const combined = [
      ...dbSales,
      ...MOCK_VENDOR_SALES.filter((m) => !existingIds.has(m.id)),
    ];

    // Sort descending by date
    return combined.sort((a, b) => b.date.localeCompare(a.date));
  } catch (err) {
    console.warn("Error fetching vendor sales list:", err);
    return MOCK_VENDOR_SALES;
  }
}

export async function getVendorSaleById(id: string): Promise<VendorSale | null> {
  const normalizedId = id.startsWith("#") ? id : `#${id}`;
  const allSales = await getVendorSalesList();
  const found = allSales.find(
    (s) =>
      s.id === normalizedId ||
      s.id === id ||
      s.orderNumber === id ||
      s.id.replace("#", "") === id.replace("#", "")
  );
  return found || null;
}

export async function getVendorDashboardData(): Promise<VendorDashboardData> {
  const allSales = await getVendorSalesList();

  if (!isSupabaseConfigured()) {
    const activeCount = allSales.filter((s) => s.status === "Processing").length;
    const completedCount = allSales.filter((s) => s.status === "Completed").length;
    const totalBalance = allSales.reduce((acc, s) => acc + (s.paymentStatus === "Payment Received" ? s.total : 0), 1009.48);

    return {
      ...mockDashboardData,
      stats: {
        totalSales: allSales.length,
        balance: Math.round(totalBalance * 100) / 100,
        products: 24,
        pendingProducts: 0,
      },
      salesBreakdown: [
        { name: "Active Sales", value: activeCount || 7, color: "#00C9A7" },
        { name: "Completed Sales", value: completedCount || 8, color: "#6C5CE7" },
      ],
      sales: allSales.slice(0, 5),
    };
  }

  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return mockDashboardData;

    const vendorId = "usr-vendor-01";

    const [vendorProfile, productsData, reviewsData, commentsData] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", vendorId).maybeSingle(),
      supabase.from("products").select("*").eq("vendor_id", vendorId),
      supabase.from("reviews").select("*").eq("vendor_id", vendorId).order("created_at", { ascending: false }).limit(5),
      supabase.from("comments").select("*").eq("vendor_id", vendorId).order("created_at", { ascending: false }).limit(5),
    ]);

    const activeCount = allSales.filter((s) => s.status === "Processing").length;
    const completedCount = allSales.filter((s) => s.status === "Completed").length;

    const stats: VendorStats = {
      totalSales: allSales.length,
      balance: (vendorProfile.data as { balance?: number } | null | undefined)?.balance ?? 1009.48,
      products: productsData.data?.length ?? 24,
      pendingProducts:
        productsData.data?.filter((p: { status?: string }) => p.status === "pending").length ?? 0,
    };

    const salesBreakdown: VendorDonutSegment[] = [
      {
        name: "Active Sales",
        value: activeCount || 7,
        color: "#00C9A7",
      },
      {
        name: "Completed Sales",
        value: completedCount || 8,
        color: "#6C5CE7",
      },
    ];

    const reviews: VendorReview[] = (reviewsData.data ?? []).map((r: { id?: string; comment?: string; product_name?: string; date?: string; rating?: number }) => ({
      id: r.id ?? "0",
      comment: r.comment ?? "",
      product: r.product_name ?? "Unknown Product",
      date: r.date ?? new Date().toISOString(),
      rating: r.rating ?? 0,
    }));

    const comments: VendorComment[] = (commentsData.data ?? []).map((c: { id?: string; content?: string; product_name?: string; date?: string }) => ({
      id: c.id ?? "0",
      comment: c.content ?? "",
      product: c.product_name ?? "Unknown Product",
      date: c.date ?? new Date().toISOString(),
    }));

    return {
      vendor: {
        name: (vendorProfile.data as { full_name?: string } | null | undefined)?.full_name ?? "Trendshop",
        storeName: (vendorProfile.data as { store_name?: string } | null | undefined)?.store_name ?? "Trendshop Store",
        avatarUrl: (vendorProfile.data as { avatar_url?: string } | null | undefined)?.avatar_url ?? null,
      },
      stats,
      salesBreakdown,
      monthlySales: mockDashboardData.monthlySales,
      comments: comments.length ? comments : mockDashboardData.comments,
      reviews: reviews.length ? reviews : mockDashboardData.reviews,
      sales: allSales.slice(0, 5),
    };
  } catch {
    return mockDashboardData;
  }
}

