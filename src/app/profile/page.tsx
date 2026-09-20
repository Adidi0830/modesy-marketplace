import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { getCategories } from "@/lib/services/categoryService";
import { ProfileClient } from "@/components/profile/ProfileClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile - Modesy Marketplace",
  description: "View user profile, followers, following, and reviews on Modesy.",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const categories = await getCategories();

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <Header categories={categories} />
      <main className="flex-1 pt-44 pb-16">
        <ProfileClient />
      </main>
      <Footer />
    </div>
  );
}
