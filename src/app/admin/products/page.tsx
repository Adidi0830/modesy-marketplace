/**
 * @file Halaman daftar produk admin (Read + Delete).
 *
 * Client Component — memuat daftar produk lewat `getAllProducts`,
 * menampilkan {@link ProductListTable}, dan memperbarui state setelah
 * penghapusan. Tombol "Add Product" navigasi ke `/admin/products/add`.
 */
"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, RefreshCw } from "lucide-react";
import type { Product } from "@/types";
import { getAllProducts } from "@/lib/services/productService";
import { deleteProductAction } from "@/app/admin/products/actions";
import ProductListTable from "@/components/admin/ProductListTable";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Muat awal: async IIFE di dalam effect (hindari setState synchronous).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAllProducts();
        if (!cancelled) setProducts(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Gagal memuat produk");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Refresh manual (dipanggil dari event handler, bukan effect).
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat produk");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const result = await deleteProductAction(id);
        if (result.success) setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menghapus produk");
      }
    },
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500">{products.length} product(s)</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadProducts}
            disabled={isLoading}
            aria-label="Refresh"
            className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            href="/admin/products/add"
            className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      <ProductListTable products={products} onDelete={handleDelete} isLoading={isLoading} />
    </div>
  );
}
