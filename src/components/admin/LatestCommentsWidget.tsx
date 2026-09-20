/**
 * @file LatestCommentsWidget component.
 * Displays a scrollable list of the most recent product/store comments
 * with author avatar, name, content snippet, and date.
 *
 * @param comments - Array of comment records (Supabase or mock).
 */
import Link from "next/link";
import type { LatestComment } from "@/types/dashboard";

export default function LatestCommentsWidget({ comments }: { comments: LatestComment[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <WidgetHeader title="Latest Comments" />
      <ul className="divide-y divide-gray-100">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} />
        ))}
      </ul>
    </div>
  );
}

function WidgetHeader({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <Link
        href="/admin/comments"
        className="text-xs text-blue-600 hover:underline"
      >
        View All
      </Link>
    </div>
  );
}

function CommentItem({ comment }: { comment: LatestComment }) {
  return (
    <li className="flex items-start gap-3 py-2">
      <img
        src={comment.authorAvatar || "/placeholder.png"}
        alt={comment.authorName}
        className="h-7 w-7 rounded-full object-cover"
      />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{comment.authorName}</p>
        <p className="text-xs text-gray-600 line-clamp-2">{comment.content}</p>
        <p className="mt-1 text-xs text-gray-400">{formatDate(comment.date)}</p>
        {comment.productTitle && (
          <p className="mt-0.5 text-[10px] italic text-gray-400">
            on &ldquo;{comment.productTitle}&rdquo;
          </p>
        )}
      </div>
    </li>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
