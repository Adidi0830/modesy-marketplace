export interface VendorProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  original_price?: number;
  image_url: string;
  images?: string[];
  category_name?: string;
  vendor_id: string;
  status: "active" | "pending" | "inactive";
  description?: string;
  short_description?: string;
  tags?: string[];
  stock: number;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  is_special_offer: boolean;
  discount_percentage: number;
  product_type?: "physical" | "digital";
  listing_type?: "sale" | "listing" | "quote" | "license";
  created_at: string;
}
