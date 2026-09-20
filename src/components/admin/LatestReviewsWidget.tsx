/**
 * @file LatestReviewsWidget component.
 * Shows the latest product reviews with star rating, product name,
 * reviewer avatar, comment, and date.
 *
 * @param reviews - Array of review records (Supabase or mock).
 */
import Link from "next/link";
import { Star } from "lucide-react";
import type { LatestReview } from "@/types/dashboard";

export default function LatestReviewsWidget({ reviews }: { reviews: LatestReview[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Latest Reviews</h3>
        <Link
          href="/admin/reviews"
          className="text-xs text-blue-600 hover:underline"
        >
          View All
        </Link>
      </div>
      <ul className="divide-y divide-gray-100">
        {reviews.map((r) => (
          <ReviewItem key={r.id} review={r} />
        ))}
      </ul>
    </div>
  );
}

function ReviewItem({ review }: { review: LatestReview }) {
  return (
    <li className="flex items-start gap-3 py-2">
      <img
        src={review.authorAvatar || "/placeholder.png"}
        alt={review.authorName}
        className="h-7 w-7 rounded-full object-cover"
      />
      <div className="flex-1">
        <StarRating value={review.rating} />
        <p className="text-sm font-medium text-gray-800">{review.productName}</p>
        <p className="text-xs text-gray-600 line-clamp-2">{review.comment}</p>
        <p className="mt-1 text-xs text-gray-400">
          by {review.authorName} · {formatDate(review.date)}
        </p>
      </div>
    </li>
  );
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
