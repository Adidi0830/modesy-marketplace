"use server";

import { getSupabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const title = (formData.get("title") as string) || "";
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    const price = parseFloat((formData.get("price") as string) || "0");
    const originalPrice = parseFloat((formData.get("originalPrice") as string) || "0");
    const categoryName = (formData.get("category") as string) || "";
    const imageUrl = (formData.get("imageUrl") as string) || "";

    let categoryId = "";
    if (categoryName) {
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .eq("name", categoryName)
        .maybeSingle();
      if (catData) {
        categoryId = catData.id;
      }
    }

    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert({
        name: title,
        slug,
        price: price || undefined,
        discount_price: originalPrice || undefined,
        image_url: imageUrl,
        category_id: categoryId || null,
        stock: 0,
        seller_name: "Admin",
        vendor_id: null,
      })
      .select()
      .single();

    if (productError) {
      return { success: false, error: productError.message };
    }

    revalidatePath("/admin/products");
    return { success: true, data: productData };
  } catch (err) {
    return { success: false, error: String(err) || "Unknown error" };
  }
}

export async function updateProduct(formData: FormData) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const id = (formData.get("id") as string) || "";
    const title = (formData.get("title") as string) || "";
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    const price = parseFloat((formData.get("price") as string) || "0");
    const originalPrice = parseFloat((formData.get("originalPrice") as string) || "0");
    const categoryName = (formData.get("category") as string) || "";
    const imageUrl = (formData.get("imageUrl") as string) || "";

    let categoryId = "";
    if (categoryName) {
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .eq("name", categoryName)
        .maybeSingle();
      if (catData) {
        categoryId = catData.id;
      }
    }

    const { data: productData, error: productError } = await supabase
      .from("products")
      .update({
        name: title,
        slug,
        price: price || undefined,
        discount_price: originalPrice || undefined,
        image_url: imageUrl,
        category_id: categoryId || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (productError) {
      return { success: false, error: productError.message };
    }

    revalidatePath("/admin/products");
    return { success: true, data: productData };
  } catch (err) {
    return { success: false, error: String(err) || "Unknown error" };
  }
}

export async function deleteProductAction(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) || "Unknown error" };
  }
}
