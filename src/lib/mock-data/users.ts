/**
 * @file users.ts
 * @description Data akun default untuk 4 role Modesy: superadmin, moderator, vendor, member
 */

import { UserAccount, RoleMeta, UserRole } from "@/types";

export const DEFAULT_USERS: UserAccount[] = [
  {
    id: "1a4230a8-5a8b-442a-8973-7d906eb75777",
    email: "superadmin@modesy.com",
    password: "Password123!",
    username: "superadmin",
    fullName: "Super Admin Modesy",
    role: "superadmin",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phoneNumber: "+62 812-0000-0001",
    storeName: null,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "a92b0718-e22f-45c7-a143-979908ce662f",
    email: "moderator@modesy.com",
    password: "Password123!",
    username: "moderator",
    fullName: "Moderator Modesy",
    role: "moderator",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phoneNumber: "+62 812-0000-0002",
    storeName: null,
    createdAt: "2026-01-05T00:00:00Z",
  },
  {
    id: "207fae18-f22a-4875-8d38-d91b32655904",
    email: "vendor@modesy.com",
    password: "Password123!",
    username: "trendshop",
    fullName: "Trendshop",
    role: "vendor",
    storeName: "Trendshop",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phoneNumber: "+62 812-0000-0003",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "54c6c0de-6046-4bc0-a38b-be4d5b9e7ecc",
    email: "member@modesy.com",
    password: "Password123!",
    username: "peterjones",
    fullName: "Peter Jone",
    role: "member",
    avatarUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80",
    phoneNumber: "+62 812-0000-0004",
    storeName: null,
    createdAt: "2026-08-01T00:00:00Z",
  },
];

export const ROLE_METADATA: Record<UserRole, RoleMeta> = {
  superadmin: {
    role: "superadmin",
    label: "Super Admin",
    badgeClass: "bg-purple-100 text-purple-700 border-purple-200",
    description: "Akses penuh ke seluruh sistem, pengguna & pengaturan toko",
    permissions: ["manage_users", "manage_settings", "view_finances", "manage_all_products"],
  },
  moderator: {
    role: "moderator",
    label: "Moderator",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
    description: "Moderasi produk, konten blog, ulasan, serta verifikasi vendor",
    permissions: ["moderate_products", "moderate_reviews", "verify_vendors", "moderate_blogs"],
  },
  vendor: {
    role: "vendor",
    label: "Vendor",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
    description: "Kelola katalog produk toko, inventaris, dan pesanan pelanggan",
    permissions: ["manage_own_products", "view_store_orders", "manage_store_profile"],
  },
  member: {
    role: "member",
    label: "Member",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
    description: "Belanja produk, kelola keranjang belanja, wishlist, dan beri review",
    permissions: ["make_orders", "manage_cart", "manage_wishlist", "write_reviews"],
  },
};

export const getUserByRole = (role: UserRole) => DEFAULT_USERS.find((u) => u.role === role);
export const getUserByEmail = (email: string) => DEFAULT_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
