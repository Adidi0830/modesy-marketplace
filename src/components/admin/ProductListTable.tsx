/**
 * @file ProductListTable component.
 *
 * Tabel daftar produk untuk halaman admin `/admin/products`. Menampilkan kolom
 * utama (gambar, judul, kategori, harga, stock, featured, aksi). Aksi meliputi
 * tautan "Edit" dan tombol "Delete" (dengan konfirmasi serta callback refresh).
 *
 * @param products - Daftar produk yang akan ditampilkan.
 * @param onDelete - Callback dipanggil ketika pengguna konfirmasi menghapus.
 * @param isLoading - Menandakan sedang memuat ulang (menonaktifkan aksi).
 */
"use client";
import Link from "next/link";
import { Edit, Trash2, Search } from "lucide-react";
import type { Product } from "@/types";
import { formatUSD } from "@/lib/utils/product-utils";

export interface ProductListTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function ProductListTable({ products, onDelete, isLoading }: ProductListTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-black-200 bg-white">
      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="text-left text-black-500">
            <th className="pb-3 font-medium">Product</th>
            <th className="pb-3 font-medium">Category</th>
            <th className="pb-3 font-medium">Price</th>
            <th className="pb-3 font-medium">Stock</th>
            <th className="pb-3 font-medium">Featured</th>
            <th className="pb-3 text-center font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-500">
                No products found.
              </td>
            </tr>
          ) : (
            products.map((p) => <ProductRow key={p.id} product={p} onDelete={onDelete} isLoading={isLoading} />)
          )}
        </tbody>
      </table>
    </div>
  );
}

interface ProductRowProps {
  product: Product;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

function ProductRow({ product, onDelete, isLoading }: ProductRowProps) {
  const handleDelete = () => {
    if (window.confirm(`Delete "${product.title}"? This action cannot be undone.`)) {
      onDelete(product.id);
    }
  };

  return (
    <tr className="border-t border-gray-100">
      <td className="py-3">
        <div className="flex items-center gap-3">
          <img
            src={product.image_url || "/placeholder.png"}
            alt={product.title}
            className="h-10 w-10 rounded object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.png";
            }}
          />
          <div className="font-medium text-gray-800">{product.title}</div>
        </div>
      </td>
      <td className="py-3 text-gray-600">{product.category_name || "—"}</td>
      <td className="py-3">
        {product.original_price ? (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">{formatUSD(product.price)}</span>
            <span className="text-gray-400 line-through">{formatUSD(product.original_price)}</span>
          </div>
        ) : (
          <span className="font-semibold text-gray-800">{formatUSD(product.price)}</span>
        )}
      </td>
      <td className="py-3 text-gray-600">{product.stock ?? 0}</td>
      <td className="py-3">
        {product.is_featured ? (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
            Yes
          </span>
        ) : (
          <span className="text-gray-400">No</span>
        )}
      </td>
      <td className="py-3 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <Link
            href={`/admin/products/${product.id}/edit`}
            aria-label={`Edit ${product.title}`}
            className={`rounded p-1 text-blue-600 hover:bg-gray-100 ${
              isLoading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <Edit size={16} />
          </Link>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            aria-label={`Delete ${product.title}`}
            className="rounded p-1 text-red-600 hover:bg-gray-100 disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

/** Helper pencarian tidak aktif (ikon disediakan untuk UI yang konsisten). */
export function SearchInput() {
  return (
    <div className="relative w-full max-w-sm">
      <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
      <input
        type="search"
        placeholder="Search products..."
        className="w-full rounded-md border border-gray-200 py-1.5 pr-3 pl-8 text-sm text-neutral-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
      />
    </div>
  );
}
