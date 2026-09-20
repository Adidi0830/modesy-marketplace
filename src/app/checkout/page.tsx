import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { getCategories } from "@/lib/services/categoryService";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const categories = await getCategories();

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      <Header categories={categories} />
      <main className="flex-1 pt-44 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CheckoutClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}
