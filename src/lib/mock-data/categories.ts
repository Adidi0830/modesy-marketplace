/**
 * @file categories.ts
 * @description Mock data kategori e-commerce (12 kategori sesuai gambar referensi Modesy Marketplace)
 */

import { Category } from "@/types";

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Clothing",
    slug: "clothing",
    image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&auto=format&fit=crop&q=80",
    icon: "Shirt",
    product_count: 1420,
  },
  {
    id: "cat-2",
    name: "Shoes",
    slug: "shoes",
    image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&auto=format&fit=crop&q=80",
    icon: "Footprints",
    product_count: 820,
  },
  {
    id: "cat-3",
    name: "Bags",
    slug: "bags",
    image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&auto=format&fit=crop&q=80",
    icon: "Briefcase",
    product_count: 430,
  },
  {
    id: "cat-4",
    name: "Accessories",
    slug: "accessories",
    image_url: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=300&auto=format&fit=crop&q=80",
    icon: "Glasses",
    product_count: 980,
  },
  {
    id: "cat-5",
    name: "Watches & Jewelry",
    slug: "watches-jewelry",
    image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&auto=format&fit=crop&q=80",
    icon: "Watch",
    product_count: 510,
  },
  {
    id: "cat-6",
    name: "Home & Living",
    slug: "home-living",
    image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&auto=format&fit=crop&q=80",
    icon: "Home",
    product_count: 730,
  },
  {
    id: "cat-7",
    name: "Kids & Baby",
    slug: "kids-baby",
    image_url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&auto=format&fit=crop&q=80",
    icon: "Smile",
    product_count: 650,
  },
  {
    id: "cat-8",
    name: "Beauty",
    slug: "beauty",
    image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80",
    icon: "Sparkles",
    product_count: 490,
  },
  {
    id: "cat-9",
    name: "Vintage",
    slug: "vintage",
    image_url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&auto=format&fit=crop&q=80",
    icon: "Clock",
    product_count: 310,
  },
  {
    id: "cat-10",
    name: "Toys",
    slug: "toys",
    image_url: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&auto=format&fit=crop&q=80",
    icon: "Gamepad2",
    product_count: 280,
  },
  {
    id: "cat-11",
    name: "Food & Drink",
    slug: "food-drink",
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80",
    icon: "Coffee",
    product_count: 360,
  },
  {
    id: "cat-12",
    name: "Craft",
    slug: "craft",
    image_url: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=300&auto=format&fit=crop&q=80",
    icon: "Scissors",
    product_count: 410,
  },
];
