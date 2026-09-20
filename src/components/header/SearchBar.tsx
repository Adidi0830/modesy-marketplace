"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Category } from "@/types";

export interface SearchBarProps {
  categories?: Category[];
}

/**
 * SearchBar Component
 * Fitur pencarian produk dengan filter kategori dropdown terintegrasi (Layout khas Modesy)
 */
export const SearchBar: React.FC<SearchBarProps> = ({ categories = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for "${searchQuery}" in ${selectedCategory}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full items-center rounded-full border border-neutral-300 bg-white shadow-xs focus-within:border-emerald-600 sm:rounded-lg"
    >
      {/* Category Dropdown (desktop/tablet) */}
      <div className="hidden border-r border-neutral-200 px-3 py-2 md:block">
        <select
          value={selectedCategory}
          aria-label="Select Category Filter"
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="max-w-[130px] truncate bg-transparent text-xs font-medium text-neutral-600 outline-none hover:cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Input Teks Pencarian */}
      <input
        type="text"
        placeholder="Search for products, brands..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-transparent px-4 py-2 text-xs text-neutral-800 placeholder-neutral-400 outline-none sm:text-sm"
      />

      {/* Tombol Search Submit */}
      <button
        type="submit"
        aria-label="Search"
        className="flex h-9 w-10 items-center justify-center rounded-r-full bg-emerald-600 text-white transition hover:bg-emerald-700 sm:h-auto sm:w-12 sm:rounded-r-lg sm:py-2.5"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
};
