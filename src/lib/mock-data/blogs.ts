/**
 * @file blogs.ts
 * @description Mock data artikel blog e-commerce Modesy sesuai gambar referensi asli (4 artikel)
 */

import { BlogPost } from "@/types";

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "Special Summer Collection for this Season",
    slug: "special-summer-collection-for-this-season",
    excerpt: "Discover vibrant colors and breathable lightweight textures crafted for warm sunny days.",
    image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    author: "Elena Vance",
    category: "Fashion Trends",
    published_at: "Sep 12, 2026",
    read_time: "5 min read",
  },
  {
    id: "post-2",
    title: "The Evolution of Modern Vintage Fashion",
    slug: "the-evolution-of-modern-vintage-fashion",
    excerpt: "Why classic 90s outerwear and heritage denim cuts are making a major comeback worldwide.",
    image_url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80",
    author: "Marcus Chen",
    category: "Style Guide",
    published_at: "Sep 08, 2026",
    read_time: "4 min read",
  },
  {
    id: "post-3",
    title: "Top Trends to Transform Your Everyday Wardrobe",
    slug: "top-trends-to-transform-your-everyday-wardrobe",
    excerpt: "Effortlessly blend casual comfort with tailored sophistication for your work and leisure.",
    image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
    author: "Sophia Taylor",
    category: "Wardrobe",
    published_at: "Aug 30, 2026",
    read_time: "6 min read",
  },
  {
    id: "post-4",
    title: "Stunning Modern and Minimalist Home Decor Ideas",
    slug: "stunning-modern-and-minimalist-home-decor",
    excerpt: "Create relaxing, sunlit indoor sanctuaries using natural woods, linens, and ceramic accents.",
    image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    author: "David Miller",
    category: "Living & Craft",
    published_at: "Aug 24, 2026",
    read_time: "5 min read",
  },
];
