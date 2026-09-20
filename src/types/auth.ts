/**
 * @file auth.ts
 * @description Tipe data untuk sistem Role dan Pengguna Modesy Marketplace
 */

export type UserRole = "superadmin" | "moderator" | "vendor" | "member";

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string | null;
  phoneNumber: string | null;
  storeName: string | null;
  createdAt: string;
}

export interface UserAccount extends UserProfile {
  password: string; // Digunakan untuk keperluan demo / initial seed
}

export interface RoleMeta {
  role: UserRole;
  label: string;
  badgeClass: string;
  description: string;
  permissions: string[];
}

