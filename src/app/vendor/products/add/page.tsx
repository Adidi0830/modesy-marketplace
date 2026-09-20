import { getCategories } from "@/lib/services/categoryService";
import ProductForm from "@/components/vendor/ProductForm";

export const dynamic = "force-dynamic";

export default async function AddProductPage() {
  const categories = await getCategories();

  return (
    <div className="p-4 lg:p-6">
      <ProductForm categories={categories} />
    </div>
  );
}
