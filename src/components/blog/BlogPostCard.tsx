import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { BlogPost } from "@/types";

export interface BlogPostCardProps {
  post: BlogPost;
}

/**
 * BlogPostCard Component
 * Kartu artikel blog e-commerce dengan gambar cover dinamis & info rilis
 */
export const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:border-emerald-500 hover:shadow-md">
      {/* Dynamic Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
        <Image
          src={post.image_url}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white uppercase">
          {post.category}
        </span>
      </div>

      {/* Post Meta & Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center gap-3 text-[11px] text-neutral-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {post.published_at}
          </span>
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {post.author}
          </span>
        </div>

        <Link
          href={`#blog-${post.slug}`}
          className="mt-2 line-clamp-2 text-sm font-bold text-neutral-900 transition group-hover:text-emerald-600 sm:text-base"
        >
          {post.title}
        </Link>

        <p className="mt-2 line-clamp-2 flex-1 text-xs text-neutral-500 sm:text-sm">
          {post.excerpt}
        </p>

        <div className="mt-4 pt-2 border-t border-neutral-100">
          <Link
            href={`#blog-${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            <span>Read More</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
