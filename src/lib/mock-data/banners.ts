/**
 * @file banners.ts
 * @description Mock data banner carousel hero, banner promosi tengah, dan triple promo banner
 */

import { Banner } from "@/types";

export const MOCK_HERO_BANNERS: Banner[] = [
  {
    id: "hero-1",
    title: "Buy Nice and Unique Clothes",
    subtitle: "Explore our handpicked curation of modern fashion and accessories.",
    cta_text: "Shop Now",
    cta_link: "#products",
    image_url: "https://noqapyqgjniunizkdicv.supabase.co/storage/v1/object/sign/hero_slide/slider_2560x800_6a94336760c054-95358530%20(1).webp?token=eyJraWQiOiJhZWI5ZWU0MS0xMWRmLTRkMTUtOGM1MC00ODM0MzgzYjVlY2EiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJoZXJvX3NsaWRlL3NsaWRlcl8yNTYweDgwMF82YTk0MzM2NzYwYzA1NC05NTM1ODUzMCAoMSkud2VicCIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODg5NjI2NjYsImV4cCI6MTgzOTkzODY2Nn0.J4dS9mCZcrswjUtMPso9vhHaAolILSBPiBaOVIpeRpcmTeFCRbFP5jFmxThcRSbyb8_wtTull-9IT8Wqos8tIg",
    tagline: "",
    placement: "hero",
    badge_color: "bg-emerald-500",
  },
  {
    id: "hero-2",
    title: "New Season Arrivals",
    subtitle: "Discover high quality handcrafted essentials with up to 40% discount.",
    cta_text: "Discover Deals",
    cta_link: "#special-offers",
    image_url: "https://noqapyqgjniunizkdicv.supabase.co/storage/v1/object/sign/hero_slide/slider_2560x800_6a9434c4d28763-19000658.webp?token=eyJraWQiOiJhZWI5ZWU0MS0xMWRmLTRkMTUtOGM1MC00ODM0MzgzYjVlY2EiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJoZXJvX3NsaWRlL3NsaWRlcl8yNTYweDgwMF82YTk0MzRjNGQyODc2My0xOTAwMDY1OC53ZWJwIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4ODk2Mjc0MywiZXhwIjoxODM5OTM4NzQzfQ.yiBT83S2a-Y5K3UBIkSpscdCggPqQnFww8Z8oO0kMbT5i4uRRDcn2JcgrKNtgoKOTU958zybzaOuTsCUCPfMVg",
    tagline: "",
    placement: "hero",
    badge_color: "bg-amber-500",
  },
];

export const MOCK_PROMO_BANNERS: Banner[] = [
  {
    id: "promo-1",
    title: "Summer Collection",
    subtitle: "Discover our special summer collection and trending aesthetics.",
    cta_text: "Shop Now",
    cta_link: "#products",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    tagline: "25% OFF",
    placement: "mid_promo",
  },
  {
    id: "promo-2",
    title: "On Sale Deals",
    subtitle: "Huge selection of seasonal items at unbeatable prices.",
    cta_text: "View Collection",
    cta_link: "#special-offers",
    image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80",
    tagline: "50% OFF",
    placement: "mid_promo",
  },
];

export const MOCK_TRIPLE_BANNERS: Banner[] = [
  {
    id: "triple-1",
    title: "Make Your Own Collection",
    subtitle: "Create and express your personal aesthetic.",
    cta_text: "Shop Now",
    cta_link: "#clothing",
    image_url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80",
    tagline: "New Arrival",
    placement: "triple_promo",
  },
  {
    id: "triple-2",
    title: "Seasonal Sale",
    subtitle: "Special discounts up to 70% on winter essentials.",
    cta_text: "Discover",
    cta_link: "#special-offers",
    image_url: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&auto=format&fit=crop&q=80",
    tagline: "Up to 70% OFF",
    placement: "triple_promo",
  },
  {
    id: "triple-3",
    title: "Signature Style",
    subtitle: "Handcrafted accessories & footwear designed to last.",
    cta_text: "Explore",
    cta_link: "#accessories",
    image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
    tagline: "15% OFF",
    placement: "triple_promo",
  },
];
