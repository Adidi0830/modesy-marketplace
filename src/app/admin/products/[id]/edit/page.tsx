/**
 * @file Halaman edit produk admin (Update).
 * Memuat produk berdasarkan `id` dari URL, lalu merender {@link ProductForm}
 * dalam mode Edit. Menampilkan state loading / error saat fetch.
 */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Product } from "@/types";
import { getProductById } from "@/lib/services/productService";
import ProductForm from "@/components/admin/ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default function AdminEditProductPage({ params }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { id } = await params;
      try {
        const data = await getProductById(id);
        if (!data) {
          setError("Product not found");
        } else {
          setProduct(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, [params]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ChevronLeft size={16} /> <span>Loading...</span>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-500">Loading product…</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-4">
        <Link href="/admin/products" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
          <ChevronLeft size={16} /> Products
        </Link>
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error ?? "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/admin/products" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
          <ChevronLeft size={16} /> Products
        </Link>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h1 className="mb-4 text-lg font-semibold text-gray-800">Edit Product</h1>
        <ProductForm product={product} />
      </div>
    </div>
  );
}
