export interface VendorProfile {
  name: string;
  storeName: string;
  avatarUrl: string | null;
}

export interface VendorStats {
  totalSales: number;
  balance: number;
  products: number;
  pendingProducts: number;
}

export interface VendorDonutSegment {
  name: string;
  value: number;
  color: string;
}

export interface MonthlySalesPoint {
  month: string;
  sales: number;
}

export interface VendorComment {
  id: string;
  comment: string;
  product: string;
  date: string;
}

export interface VendorReview {
  id: string;
  comment: string;
  product: string;
  date: string;
  rating: number;
}

export type VendorSaleStatus = "Processing" | "Completed" | "Cancelled" | "Shipped";
export type VendorPaymentStatus = "Pending Payment" | "Payment Received" | "Refunded";

export interface VendorSaleItem {
  id: string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl?: string;
}

export interface VendorSale {
  id: string;
  orderNumber?: string;
  total: number;
  status: VendorSaleStatus;
  paymentStatus: VendorPaymentStatus;
  paymentMethod?: string;
  date: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  shippingMethod?: string;
  items?: VendorSaleItem[];
}

export interface VendorDashboardData {
  vendor: VendorProfile;
  stats: VendorStats;
  salesBreakdown: VendorDonutSegment[];
  monthlySales: MonthlySalesPoint[];
  comments: VendorComment[];
  reviews: VendorReview[];
  sales: VendorSale[];
}
