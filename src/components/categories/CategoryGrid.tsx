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
 * Menampilkan kategori lingkaran (Mobile: 3 kolom persis screenshot Modesy, Desktop: 6 kolom)
 */
export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section id="categories" className="py-4 sm:py-7">
      <Container>
        <SectionHeading
          title="Shop By Category"
          viewAllLabel="View All"
          viewAllHref="#all-categories"
        />

        {/* 
          Grid Kategori:
          - Mobile: 3 kolom (persis screenshot Modesy)
          - Tablet (sm): 4 kolom
          - Desktop (md/lg): 6 kolom
        */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6 md:gap-y-6 md:gap-x-4">
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
