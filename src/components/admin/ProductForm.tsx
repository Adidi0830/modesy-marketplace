/**
 * @file ProductForm component.
 *
 * Formulir modal untuk Create dan Edit produk pada role Super Admin.
 * Bersifat self-contained: memvalidasi input, memanggil server action
 * (`addProduct` / `updateProduct`), lalu navigasi kembali ke daftar.
 *
 * Mode ditentukan oleh prop opsional `product`:
 *  - tidak disertakan  -> mode Create
 *  - disertakan        -> mode Edit
 */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, X, ImageIcon } from "lucide-react";
import type { Product } from "@/types";
import { addProduct, updateProduct } from "@/app/admin/products/actions";

export interface ProductFormProps {
  product?: Product;
}

const CATEGORIES = [
  "Men",
  "Women",
  "Kids & Baby",
  "Shoes & Footwear",
  "Bags & Luggage",
  "Jewelry & Watches",
  "Electronics",
  "Home & Living",
  "Beauty",
  "Sports",
];

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [form, setForm] = useState({
    title: product?.title ?? "",
    slug: product?.slug ?? "",
    price: product?.price ?? 0,
    originalPrice: product?.original_price ?? undefined as number | undefined,
    imageUrl: product?.image_url ?? "",
    category: product?.category_name ?? "",
    isFeatured: product?.is_featured ?? false,
    isSpecialOffer: product?.is_special_offer ?? false,
    stock: product?.stock ?? 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleChange = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    setSaveError(null);
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "Judul produk wajib diisi";
    if (!form.imageUrl.trim()) next.imageUrl = "URL gambar wajib diisi";
    if (isNaN(form.price) || form.price <= 0) next.price = "Harga harus angka positif";
    if (form.originalPrice && form.originalPrice <= form.price) {
      next.originalPrice = "Harga asli harus melebihi harga jual";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("price", String(form.price));
      fd.append("originalPrice", form.originalPrice ? String(form.originalPrice) : "0");
      fd.append("stock", String(form.stock));
      fd.append("category", form.category);
      fd.append("isFeatured", form.isFeatured ? "on" : "");
      fd.append("isSpecialOffer", form.isSpecialOffer ? "on" : "");
      fd.append("imageUrl", form.imageUrl);
      if (isEdit && product) {
        fd.append("id", product.id);
        const result = await updateProduct(fd);
        if (!result.success) setSaveError(result.error || "Gagal memperbarui produk");
      } else {
        const result = await addProduct(fd);
        if (!result.success) setSaveError(result.error || "Gagal menambahkan produk");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Gagal menyimpan produk");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {saveError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{saveError}</div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Kolom kiri: teks */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-neutral-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
              placeholder="e.g. Casual Cotton Bomber Jacket"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-neutral-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
              placeholder="auto-generated if empty"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL *</label>
            <div className="relative mt-1">
              <ImageIcon size={16} className="absolute left-2 top-2.5 text-gray-400" />
              <input
                type="img"
                value={form.imageUrl}
                onChange={(e) => handleChange("imageUrl", e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-2 pr-3 pl-8 text-sm text-neutral-900 dark:text-neutral-100 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            {errors.imageUrl && <p className="mt-1 text-xs text-red-600">{errors.imageUrl}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={form.category ?? ""}
              onChange={(e) =>
                handleChange("category", e.target.value || undefined)
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-neutral-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Kolom kanan: harga, stok, toggle */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price (USD) *</label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute left-2 top-2.5 text-gray-400">$</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) => handleChange("price", Number(e.target.value))}
                className="block w-full rounded-md border border-gray-300 py-2 pr-3 pl-7 text-sm text-neutral-900 dark:text-neutral-100 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
              />
            </div>
            {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Original Price (USD)</label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute left-2 top-2.5 text-gray-400">$</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.originalPrice ?? ""}
                onChange={(e) =>
                  handleChange("originalPrice", e.target.value ? Number(e.target.value) : undefined)
                }
                className="block w-full rounded-md border border-gray-300 py-2 pr-3 pl-7 text-sm text-neutral-900 dark:text-neutral-100 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
              />
            </div>
            {errors.originalPrice && <p className="mt-1 text-xs text-red-600">{errors.originalPrice}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              min={0}
              value={form.stock ?? 0}
              onChange={(e) => handleChange("stock", Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-neutral-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.isFeatured ?? false}
                onChange={(e) => handleChange("isFeatured", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.isSpecialOffer ?? false}
                onChange={(e) => handleChange("isSpecialOffer", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
              />
              Special Offer
            </label>
          </div>

          {form.imageUrl ? (
            <img
              src={form.imageUrl}
              alt="preview"
              className="mt-2 h-24 w-full rounded border border-gray-200 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="flex items-center gap-1.5 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <X size={16} /> Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          <Save size={16} />
          {isSaving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
