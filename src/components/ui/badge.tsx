import type { HTMLAttributes } from "react";

export type BadgeVariant = "default" | "green" | "yellow" | "blue" | "indigo";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700",
  green: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  yellow: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  blue: "bg-sky-50 text-sky-700 ring-1 ring-sky-100",
  indigo: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
};

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
