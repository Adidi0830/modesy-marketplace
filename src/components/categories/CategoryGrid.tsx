import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryItem } from "./CategoryItem";
import { Category } from "@/types";

export interface CategoryGridProps {
  categories: Category[];
}

/**
 * CategoryGrid Component
 * Menampilkan 12 kategori lingkaran (Mobile: 4 kolom x 3 baris, Desktop: 6 kolom x 2 baris)
 */
export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section id="categories" className="py-4 sm:py-7">
      <Container>
        <SectionHeading
          title="Shop by Category"
          subtitle="Explore our wide variety of curated categories and departments"
          viewAllLabel="View All"
          viewAllHref="#all-categories"
        />

        {/* 
          Grid 12 Kategori:
          - Mobile (<640px): 4 kolom (3 baris rapi)
          - Tablet (sm): 4 kolom
          - Desktop (md/lg): 6 kolom (2 baris)
        */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 md:grid-cols-6 md:gap-y-6 md:gap-x-4">
          {categories.slice(0, 12).map((category) => (
            <div key={category.id} className="flex justify-center">
              <CategoryItem category={category} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
