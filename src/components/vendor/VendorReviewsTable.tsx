"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ReviewRow {
  id: string;
  comment: string;
  product: string;
  date: string;
  rating: number;
}

interface VendorReviewsTableProps {
  reviews?: ReviewRow[];
}

const sampleReviews: ReviewRow[] = [
  {
    id: "4",
    comment: "Test 1",
    product: "Animal colorful digital prints",
    date: "2026-09-03 / 22:40",
    rating: 4,
  },
  {
    id: "7",
    comment: "The summer fashion lace...",
    product: "Summer fashion top lace",
    date: "2026-08-05 / 14:04",
    rating: 4,
  },
];

export default function VendorReviewsTable({ reviews = sampleReviews }: VendorReviewsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-xs">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="pb-2 font-medium">Id</th>
                <th className="pb-2 font-medium">Comment</th>
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <ReviewRow key={r.id} review={r} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href="/vendor/reviews"
          className="w-full rounded-lg border border-slate-200 py-2 text-center text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          View All
        </Link>
      </CardFooter>
    </Card>
  );
}

function ReviewRow({ review }: { review: ReviewRow }) {
  return (
    <tr className="border-t border-slate-100">
      <td className="py-2 text-slate-600">{review.id}</td>
      <td className="py-2 text-slate-700 line-clamp-1">
        <span className="inline-flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={10}
              className={
                i < review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-slate-200 text-slate-200"
              }
            />
          ))}
        </span>{" "}
        {review.comment}
      </td>
      <td className="py-2 text-slate-600">{review.product}</td>
      <td className="py-2 text-slate-500">{review.date}</td>
    </tr>
  );
}
