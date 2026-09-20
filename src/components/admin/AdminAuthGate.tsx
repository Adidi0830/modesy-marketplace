/**
 * @file AdminAuthGate component.
 *
 * Client-side guard for the `/admin` route tree. It relies on the project's
 * existing mock auth context (`useAuth`) which reads the active role from
 * localStorage. Only users whose role is `superadmin` may proceed;
 * everyone else is redirected appropriately.
 *
 * Note: this application does NOT use Supabase Auth for session management —
 * authentication state lives entirely in `AuthContext` (localStorage-backed).
 *
 * @param children - Protected dashboard subtree.
 */
"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminAuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentUser) {
    router.replace("/login");
    return <LoadingBlock />;
  }

  if (currentUser.role !== "superadmin") {
    router.replace("/");
    return <LoadingBlock />;
  }

  return <>{children}</>;
}

/** Placeholder while redirecting. */
function LoadingBlock() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 text-gray-500">
      Checking access...
    </div>
  );
}
