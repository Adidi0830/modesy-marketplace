"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import Link from "next/link";
import { Plus, RefreshCw, Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/types";
import { getAllProducts } from "@/lib/services/productService";
import { deleteProduct } from "@/app/vendor/products/actions";
import { formatUSD } from "@/lib/utils/product-utils";

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmed) return;

    setDeletingId(id);
    startTransition(async () => {
      try {
        const res = await deleteProduct(id);
        if (res.success) {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        } else {
          setError(res.error || "Gagal menghapus produk");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menghapus produk");
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Products</h1>
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
            href="/vendor/products/add"
            className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-500">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-500">No products found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => {
                const productName = (p as Product & { name?: string }).name || p.title || "Untitled";
                const isItemDeleting = deletingId === p.id;

                return (
                  <tr key={p.id} className="transition hover:bg-slate-50/75">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url || "/placeholder.png"}
                          alt={productName}
                          className="h-11 w-11 rounded-lg border border-slate-200 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";
                          }}
                        />
                        <div>
                          <div className="font-semibold text-slate-800 line-clamp-1">
                            {productName}
                          </div>
                          <div className="text-xs text-slate-400">ID: {p.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{p.category_name || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{formatUSD(p.price || 0)}</div>
                      {p.original_price && p.original_price > p.price && (
                        <div className="text-xs text-slate-400 line-through">
                          {formatUSD(p.original_price)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        (p.stock ?? 0) > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      }`}>
                        {p.stock ?? 0} in stock
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/vendor/products/edit/${p.id}`}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
                          title="Edit product"
                        >
                          <Pencil size={13} />
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, productName)}
                          disabled={isItemDeleting || isPending}
                          className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-100 hover:text-rose-700 disabled:opacity-50"
                          title="Delete product"
                        >
                          <Trash2 size={13} className={isItemDeleting ? "animate-spin" : ""} />
                          <span>{isItemDeleting ? "..." : "Delete"}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
