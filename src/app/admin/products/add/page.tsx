/**
 * @file Halaman tambah produk admin (Create).
 * Hanya merender {@link ProductForm} dalam mode Create.
 */
"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";

export default function AdminAddProductPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/products"
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft size={16} /> Products
        </Link>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h1 className="mb-4 text-lg font-semibold text-gray-800">Add New Product</h1>
        <ProductForm />
      </div>
    </div>
  );
}
