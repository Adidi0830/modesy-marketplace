"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface CommentRow {
  id: string;
  comment: string;
  product: string;
  date: string;
}

interface VendorCommentsTableProps {
  comments?: CommentRow[];
}

export default function VendorCommentsTable({ comments = [] }: VendorCommentsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Comments</CardTitle>
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
              {comments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    No comments yet
                  </td>
                </tr>
              ) : (
                comments.map((c) => <CommentRow key={c.id} comment={c} />)
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href="/vendor/comments"
          className="w-full rounded-lg border border-slate-200 py-2 text-center text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          View All
        </Link>
      </CardFooter>
    </Card>
  );
}

function CommentRow({ comment }: { comment: CommentRow }) {
  return (
    <tr className="border-t border-slate-100">
      <td className="py-2 text-slate-600">{comment.id}</td>
      <td className="py-2 text-slate-700 line-clamp-1">{comment.comment}</td>
      <td className="py-2 text-slate-600">{comment.product}</td>
      <td className="py-2 text-slate-500">{comment.date}</td>
    </tr>
  );
}
