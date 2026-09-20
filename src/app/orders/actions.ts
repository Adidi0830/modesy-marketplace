"use server";

import { getSupabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface OrderItem {
  productId: string;
  quantity: number;
}

export async function placeOrder(formData: FormData) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const customerName = (formData.get("customerName") as string) || "";
    const customerEmail = (formData.get("customerEmail") as string) || "";
    const customerPhone = (formData.get("customerPhone") as string) || "+62 812-0000-0000";
    const address = (formData.get("address") as string) || "Standard Delivery Address";
    const userId = (formData.get("userId") as string) || "54c6c0de-6046-4bc0-a38b-be4d5b9e7ecc";

    const itemsJson = (formData.get("items") as string) || "[]";
    let items: OrderItem[] = [];
    try {
      items = JSON.parse(itemsJson);
    } catch {
      return { success: false, error: "Invalid cart data" };
    }

    if (!customerName.trim()) {
      return { success: false, error: "Customer name is required" };
    }
    if (!customerEmail.trim()) {
      return { success: false, error: "Email is required" };
    }
    if (items.length === 0) {
      return { success: false, error: "Cart is empty" };
    }

    // Calculate total and validate products stock
    let totalAmount = 0;
    const resolvedProducts: Record<string, { name: string; price: number; stock: number }> = {};

    for (const item of items) {
      const { data: product, error: pErr } = await supabase
        .from("products")
        .select("id, name, price, discount_price, stock")
        .eq("id", item.productId)
        .maybeSingle();

      if (pErr || !product) {
        console.error("Product lookup error:", { productId: item.productId, pErr });
        return { success: false, error: `Product not found: ${item.productId}` };
      }

      if ((product.stock ?? 0) < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${product.name || "Product"} (Available: ${product.stock ?? 0})`,
        };
      }

      const rawPrice = Number(product.discount_price ?? product.price ?? 0);
      const price = rawPrice >= 1000 ? rawPrice / 1000 : rawPrice;
      const productName = product.name || "Product";

      resolvedProducts[item.productId] = {
        name: productName,
        price,
        stock: product.stock ?? 10,
      };

      totalAmount += price * item.quantity;
    }

    const paymentMethod = (formData.get("paymentMethod") as string) || "cod";

    // Insert order into 'orders' table
    let orderData: any = null;
    let orderError: any = null;

    const resWithPayment = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total: Math.round(totalAmount * 100) / 100,
        shipping_name: customerName,
        shipping_phone: customerPhone.trim() || "+62 812-0000-0000",
        shipping_address: address.trim() || "Standard Shipping Address",
        status: "pending",
        payment_method: paymentMethod,
      })
      .select()
      .single();

    if (resWithPayment.error && resWithPayment.error.message?.includes("column")) {
      const resFallback = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          total: Math.round(totalAmount * 100) / 100,
          shipping_name: customerName,
          shipping_phone: customerPhone.trim() || "+62 812-0000-0000",
          shipping_address: address.trim() || "Standard Shipping Address",
          status: "pending",
        })
        .select()
        .single();
      orderData = resFallback.data;
      orderError = resFallback.error;
    } else {
      orderData = resWithPayment.data;
      orderError = resWithPayment.error;
    }

    if (orderError || !orderData) {
      console.error("Error creating order:", orderError);
      return { success: false, error: orderError?.message || "Failed to create order" };
    }

    const orderId = orderData.id as string;

    // Insert items into 'order_items' and explicitly subtract stock from products in database & store
    for (const item of items) {
      const prod = resolvedProducts[item.productId];
      if (!prod) continue;

      const { error: itemErr } = await supabase.from("order_items").insert({
        order_id: orderId,
        product_id: item.productId,
        product_name: prod.name,
        quantity: item.quantity,
        price: prod.price,
      });

      if (itemErr) {
        console.error("Error inserting order item:", itemErr);
      }

      // Explicitly update product stock in Supabase database
      const newStock = Math.max(0, (prod.stock ?? 0) - item.quantity);
      const { error: stockErr } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", item.productId);

      if (stockErr) {
        console.error(`Error updating stock for product ${item.productId}:`, stockErr);
      }
    }

    // Generate Midtrans Snap Token for online payment methods
    let snapToken: string | undefined;
    let redirectUrl: string | undefined;

    if (paymentMethod !== "cod") {
      const { createMidtransSnapToken, convertUsdToIdr } = await import(
        "@/lib/services/midtransService"
      );

      const itemDetails = items.map((item) => {
        const prod = resolvedProducts[item.productId];
        return {
          id: item.productId,
          price: convertUsdToIdr(prod.price),
          quantity: item.quantity,
          name: prod.name.slice(0, 50),
        };
      });

      const snapRes = await createMidtransSnapToken({
        orderId,
        grossAmount: convertUsdToIdr(totalAmount),
        customerDetails: {
          first_name: customerName,
          email: customerEmail,
          phone: customerPhone,
          billing_address: {
            first_name: customerName,
            address,
            phone: customerPhone,
          },
          shipping_address: {
            first_name: customerName,
            address,
            phone: customerPhone,
          },
        },
        items: itemDetails,
      });

      if (snapRes.success && snapRes.data) {
        snapToken = snapRes.data.token;
        redirectUrl = snapRes.data.redirect_url;
      }
    }

    revalidatePath("/vendor/products");
    revalidatePath("/vendor/sales");
    revalidatePath("/vendor");
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/orders");
    revalidatePath("/");
    return { success: true, data: orderData, snapToken, redirectUrl };
  } catch (err) {
    console.error("Unexpected error in placeOrder:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
