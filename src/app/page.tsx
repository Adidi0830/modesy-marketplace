import { Header } from "@/components/header/Header";
import { HeroSlider } from "@/components/hero/HeroSlider";
import { CategoryGrid } from "@/components/categories/CategoryGrid";
import { ProductGrid } from "@/components/products/ProductGrid";
import { PromoBanners } from "@/components/promo/PromoBanners";
import { TriplePromoBanners } from "@/components/promo/TriplePromoBanners";
import { BrandSection } from "@/components/brands/BrandSection";
import { BlogSection } from "@/components/blog/BlogSection";
import { Footer } from "@/components/footer/Footer";
import { getCategories } from "@/lib/services/categoryService";
import {
  getFeaturedProducts,
  getSpecialOfferProducts,
  getLatestProducts,
  getProductsByCategory,
} from "@/lib/services/productService";
import { getBanners } from "@/lib/services/bannerService";
import { getBrands } from "@/lib/services/brandService";
import { getLatestBlogPosts } from "@/lib/services/blogService";

/**
 * Landing Page Modesy Marketplace
 * Tata letak dan urutan bagian disesuaikan persis dengan gambar referensi asli Modesy
 */
export default async function Home() {
  const [
    categories,
    heroBanners,
    promoBanners,
    triplePromoBanners,
    specialOffers,
    featuredProducts,
    latestProducts,
    clothingProducts,
    accessoriesProducts,
    brands,
    blogPosts,
  ] = await Promise.all([
    getCategories(),
    getBanners("hero"),
    getBanners("mid_promo"),
    getBanners("triple_promo"),
    getSpecialOfferProducts(6),
    getFeaturedProducts(12),
    getLatestProducts(12),
    getProductsByCategory("Clothing", 6),
    getProductsByCategory("Accessories", 6),
    getBrands(),
    getLatestBlogPosts(4),
  ]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-[52px] sm:pt-[56px] md:pt-[145px]">
      {/* 1. Header with TopBar, Search, and Category Bar */}
      <Header categories={categories} />

      <main className="space-y-2">
        {/* 2. Hero Slider Banner */}
        <HeroSlider banners={heroBanners} />

        {/* 3. Shop by Category (12 circular categories in 2x6 grid) */}
        <CategoryGrid categories={categories} />

        {/* 4. Special Offers (6 products with SALE badges and arrows) */}
        <ProductGrid
          title="Special Offers"
          products={specialOffers}
          viewAllHref="#special-offers"
          sectionId="special-offers"
          hasArrows={true}
        />

        {/* 5. Dual Mid Promo Banners (2 Banners: Summer 25% OFF & On Sale 50% OFF) */}
        <PromoBanners banners={promoBanners} />

        {/* 6. Featured Products (12 products with Load More button) */}
        <ProductGrid
          title="Featured Products"
          products={featuredProducts}
          sectionId="featured"
          showLoadMore={true}
          initialCount={12}
        />

        {/* 7. Latest Products (12 products with View All) */}
        <ProductGrid
          title="Latest Products"
          products={latestProducts}
          viewAllHref="#latest-products"
          sectionId="latest"
        />

        {/* 8. Triple Promo Banners (3 horizontal banner cards) */}
        <TriplePromoBanners banners={triplePromoBanners} />

        {/* 9. Clothing Showcase (6 products) */}
        <ProductGrid
          title="Clothing"
          products={clothingProducts}
          viewAllHref="/category/clothing"
          sectionId="clothing"
        />

        {/* 10. Jewelry & Accessories Showcase (6 products with slider arrows) */}
        <ProductGrid
          title="Jewelry & Accessories"
          products={accessoriesProducts}
          viewAllHref="/category/accessories"
          sectionId="accessories"
          hasArrows={true}
        />

        {/* 11. Shop by Brand (Brand Logo Carousel with Slider Arrows) */}
        <BrandSection brands={brands} />

        {/* 12. Latest Blog Posts (4 posts with Slider Arrows) */}
        <BlogSection posts={blogPosts} />
      </main>

      {/* 13. Modesy Footer with 10 social icons, newsletter & payment logos */}
      <Footer />
    </div>
  );
}
