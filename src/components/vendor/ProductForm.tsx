"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/vendor/ImageUpload";
import RadioCard from "@/components/vendor/RadioCard";
import RichTextEditor from "@/components/vendor/RichTextEditor";
import ProductFormStepper from "@/components/vendor/ProductFormStepper";
import { addProduct, updateProduct } from "@/app/vendor/products/actions";
import { ImageFile } from "@/components/vendor/ImageUpload";

const productTypes = [
  { value: "physical", label: "Physical", description: "A tangible product that you will ship to buyers" },
  { value: "digital", label: "Digital", description: "A digital file that buyers will download" },
];

const listingTypes = [
  { value: "sale", label: "Add a Product for Sale", description: "Add a product to sell on the site" },
  { value: "listing", label: "Add a Product or Service as an Ordinary Listing", description: "Add a product or service without buy option" },
  { value: "quote", label: "Add a Product to Receive Quote Requests", description: "Add a product without adding a price to get price requests from customers" },
  { value: "license", label: "Add a Product to Sell License Keys", description: "Add a product to sell only license keys" },
];

const steps = [
  { number: 1, label: "General Information" },
  { number: 2, label: "Details" },
];

export interface ProductInitialData {
  id?: string;
  title?: string;
  shortDescription?: string;
  description?: string;
  tags?: string;
  category?: string;
  price?: string | number;
  originalPrice?: string | number;
  stock?: string | number;
  productType?: string;
  listingType?: string;
  imageUrl?: string;
  images?: string[];
}

interface ProductFormProps {
  categories: { id: string; name: string }[];
  initialData?: ProductInitialData;
}

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(initialData?.id);

  const [productType, setProductType] = useState(initialData?.productType || "physical");
  const [listingType, setListingType] = useState(initialData?.listingType || "sale");
  const [images, setImages] = useState<ImageFile[]>(() => {
    if (initialData?.images && initialData.images.length > 0) {
      return initialData.images.map((url) => ({ url }));
    }
    if (initialData?.imageUrl) {
      return [{ url: initialData.imageUrl }];
    }
    return [];
  });
  const [title, setTitle] = useState(initialData?.title || "");
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [tags, setTags] = useState(initialData?.tags || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [price, setPrice] = useState(initialData?.price != null ? String(initialData.price) : "");
  const [originalPrice, setOriginalPrice] = useState(initialData?.originalPrice != null ? String(initialData.originalPrice) : "");
  const [stock, setStock] = useState(initialData?.stock != null ? String(initialData.stock) : "0");
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("shortDescription", shortDescription);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("originalPrice", originalPrice);
    formData.append("stock", stock);
    formData.append("productType", productType);
    formData.append("listingType", listingType);

    // Existing images without new File
    images
      .filter((img) => !img.file && img.url)
      .forEach((img) => formData.append("existingImages", img.url));

    // Newly added File objects
    images
      .filter((img) => img.file)
      .forEach(({ file }) => {
        if (file) formData.append("images", file);
      });

    startTransition(async () => {
      try {
        const result = isEditing && initialData?.id
          ? await updateProduct(initialData.id, formData)
          : await addProduct(formData);

        if (result.success) {
          setSaveError(null);
          router.push("/vendor/products");
          router.refresh();
        } else {
          setSaveError(result.error || (isEditing ? "Gagal memperbarui produk" : "Gagal menambahkan produk"));
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Terjadi kesalahan koneksi saat menyimpan produk.";
        setSaveError(`Network/Server error: ${message}`);
      }
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      {/* Page Title */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-slate-800">
          {isEditing ? "Edit Product" : "Add Product"}
        </h1>
        {isEditing && (
          <p className="mt-1 text-xs text-slate-500">Update product details below</p>
        )}
      </div>

      {/* Error Display */}
      {saveError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {saveError}
        </div>
      )}

      {/* Stepper */}
      <ProductFormStepper steps={steps} activeStep={1} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">Images</h2>
          <ImageUpload images={images} onChange={setImages} />
        </div>

        {/* Product Type */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">Product Type</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {productTypes.map((pt) => (
              <RadioCard
                key={pt.value}
                label={pt.label}
                description={pt.description}
                value={pt.value}
                selected={productType}
                onChange={setProductType}
              />
            ))}
          </div>
        </div>

        {/* Listing Type */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">Listing Type</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {listingTypes.map((lt) => (
              <RadioCard
                key={lt.value}
                label={lt.label}
                description={lt.description}
                value={lt.value}
                selected={listingType}
                onChange={setListingType}
              />
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">Category</h2>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Details: English */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">
              Details: English
            </h2>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: "#3B82F6" }}
            >
              <span>Generate with AI</span>
              <span className="text-sm">✨</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                placeholder="Enter product title"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Short Description</label>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                rows={3}
                placeholder="Brief description of your product"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                placeholder="Type tag and hit enter"
              />
              <p className="mt-1 text-[10px] text-slate-400">
                (Add relevant keywords for your product to increase visibility
                in search results)
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Description</label>
              <RichTextEditor value={description} onChange={setDescription} />
            </div>
          </div>
        </div>

        {/* Details: Arabic (Collapsed) */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-700"
          >
            <span>Details: Arabic (Optional)</span>
            <span className="text-slate-400">
              <span className="text-lg">⌄</span>
            </span>
          </button>
        </div>

        {/* Price & Stock */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">Price &amp; Stock</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Original Price ($)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#00C9A7] focus:ring-1 focus:ring-teal-100"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#00C9A7" }}
          >
            {isPending ? "Saving..." : "✓ Save and Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
