export interface OrderItemRecord {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  user_id?: string;
  status: "pending" | "completed" | "processing" | "cancelled" | string;
  total: number;
  shipping_name?: string;
  shipping_phone?: string;
  shipping_address?: string;
  payment_method?: string;
  created_at: string;
  items?: OrderItemRecord[];
}
