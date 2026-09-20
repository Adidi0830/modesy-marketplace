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
    const description = (formData.get("description") as string) || "";
    const categoryName = (formData.get("category") as string) || "";
    const price = parseFloat((formData.get("price") as string) || "0");
    const originalPrice = parseFloat((formData.get("originalPrice") as string) || "0");
    const stock = parseInt((formData.get("stock") as string) || "0", 10);

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

    const images: string[] = [];
    const existingImages = formData.getAll("existingImages") as string[];
    images.push(...existingImages.filter(Boolean));

    const files = formData.getAll("images") as File[];
    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const fileName = `${Date.now()}-${sanitizedName}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type || "image/jpeg",
          });

        if (uploadError) {
          console.error("Supabase storage upload error:", uploadError);
        }

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(uploadData.path);
          if (urlData?.publicUrl) {
            images.push(urlData.publicUrl);
          }
        }
      }
    }

    const mainImage =
      images[0] ||
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";

    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert({
        name: title,
        slug,
        description,
        price: price || undefined,
        discount_price: originalPrice || undefined,
        image_url: mainImage,
        category_id: categoryId || null,
        stock,
        seller_name: "Trendshop",
        vendor_id: null,
      })
      .select()
      .single();

    if (productError) {
      return { success: false, error: productError.message };
    }

    revalidatePath("/vendor/products");
    revalidatePath("/");
    return { success: true, data: productData };
  } catch (err) {
    return { success: false, error: String(err) || "Unknown error" };
  }
}

export async function updateProduct(id: string, formData: FormData) {
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
    const description = (formData.get("description") as string) || "";
    const categoryName = (formData.get("category") as string) || "";
    const price = parseFloat((formData.get("price") as string) || "0");
    const originalPrice = parseFloat((formData.get("originalPrice") as string) || "0");
    const stock = parseInt((formData.get("stock") as string) || "0", 10);

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

    const images: string[] = [];
    const existingImages = formData.getAll("existingImages") as string[];
    images.push(...existingImages.filter(Boolean));

    const files = formData.getAll("images") as File[];
    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const fileName = `${Date.now()}-${sanitizedName}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type || "image/jpeg",
          });

        if (uploadError) {
          console.error("Supabase storage upload error:", uploadError);
        }

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(uploadData.path);
          if (urlData?.publicUrl) {
            images.push(urlData.publicUrl);
          }
        }
      }
    }

    const mainImage =
      images[0] ||
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";

    const { data: productData, error: productError } = await supabase
      .from("products")
      .update({
        name: title,
        slug,
        description,
        price: price || undefined,
        discount_price: originalPrice || undefined,
        image_url: mainImage,
        category_id: categoryId || null,
        stock,
      })
      .eq("id", id)
      .select()
      .single();

    if (productError) {
      return { success: false, error: productError.message };
    }

    revalidatePath("/vendor/products");
    revalidatePath("/");
    return { success: true, data: productData };
  } catch (err) {
    return { success: false, error: String(err) || "Unknown error" };
  }
}

export async function deleteProduct(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/vendor/products");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) || "Unknown error" };
  }
}
