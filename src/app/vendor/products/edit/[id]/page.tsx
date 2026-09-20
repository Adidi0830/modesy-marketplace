import { getCategories } from "@/lib/services/categoryService";
import { getProductById } from "@/lib/services/productService";
import ProductForm, { ProductInitialData } from "@/components/vendor/ProductForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    getCategories(),
    getProductById(id),
  ]);

  if (!product) {
    notFound();
  }

  const initialData: ProductInitialData = {
    id: product.id,
    title: product.title,
    description: product.description || "",
    shortDescription: product.short_description || "",
    category: product.category_name || "",
    price: product.price,
    originalPrice: product.original_price || "",
    stock: product.stock ?? 0,
    productType: (product.product_type as "physical" | "digital") || "physical",
    listingType: (product.listing_type as "sale" | "listing" | "quote" | "license") || "sale",
    imageUrl: product.image_url,
    images: product.images || (product.image_url ? [product.image_url] : []),
  };

  return (
    <div className="p-4 lg:p-6">
      <ProductForm categories={categories} initialData={initialData} />
    </div>
  );
}
