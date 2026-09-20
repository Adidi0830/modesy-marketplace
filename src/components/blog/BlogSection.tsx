import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BlogPostCard } from "./BlogPostCard";
import { BlogPost } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface BlogSectionProps {
  posts: BlogPost[];
}

/**
 * BlogSection Component
 * 4 Kolom artikel blog e-commerce Modesy dengan kontrol slider
 */
export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-6 sm:py-8">
      <Container>
        <div className="flex items-center justify-between pb-3">
          <SectionHeading
            title="Latest Blog Posts"
            subtitle="Discover style tips, ethical fashion updates, and home guides"
            viewAllLabel="View All Posts"
            viewAllHref="#all-blogs"
            className="mb-0 flex-1"
          />
          <div className="hidden items-center gap-1.5 sm:flex">
            <button
              type="button"
              aria-label="Previous blog post"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next blog post"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 4 Kolom Blog Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {posts.slice(0, 4).map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
};
