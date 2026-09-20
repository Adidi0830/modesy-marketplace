/**
 * @file userService.ts
 * @description Layanan data pengguna/profil dengan Supabase dan fallback mock data
 */

import { UserAccount, UserProfile, UserRole } from "@/types";
import { getSupabaseClient } from "@/lib/supabase/client";
import { DEFAULT_USERS } from "@/lib/mock-data/users";

export async function getUsers(): Promise<UserProfile[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return DEFAULT_USERS;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_USERS;
    }

    return data.map((item) => {
      const role = (item.role === "admin" ? "superadmin" : item.role) as UserRole;
      const fallback = DEFAULT_USERS.find((u) => u.id === item.id || u.role === role);
      return {
        id: item.id,
        email: item.email,
        username: item.username || item.email.split("@")[0],
        fullName: item.full_name || item.display_name || fallback?.fullName || "User",
        role,
        avatarUrl: item.avatar_url || fallback?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        phoneNumber: item.phone_number || fallback?.phoneNumber,
        storeName: item.store_name || fallback?.storeName,
        createdAt: item.created_at,
      };
    });
  } catch (err) {
    console.warn("Gagal mengambil data profiles dari Supabase, gunakan fallback:", err);
    return DEFAULT_USERS;
  }
}

export async function getUserByRole(role: UserRole): Promise<UserAccount | undefined> {
  return DEFAULT_USERS.find((u) => u.role === role);
}

export async function loginWithSupabase(email: string, password: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return { user: null, error: "Supabase not configured" };

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { user: null, error: error.message };

  if (data.user) {
    // Fetch profile data
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        username: profile?.username || data.user.email!.split("@")[0],
        fullName: profile?.full_name || data.user.user_metadata.full_name || "User",
        role: profile?.role as UserRole || "member",
        avatarUrl: profile?.avatar_url,
        phoneNumber: profile?.phone_number,
        storeName: profile?.store_name,
        createdAt: profile?.created_at || data.user.created_at,
        password: "", // Dummy password for Supabase users
      },
      error: null,
    };
  }

  return { user: null, error: "Login failed" };
}

export async function signupWithSupabase(email: string, password: string, fullName: string, role: UserRole = "member") {
  const supabase = getSupabaseClient();
  if (!supabase) return { user: null, error: "Supabase not configured" };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) return { user: null, error: error.message };

  if (data.user) {
    // Create profile
    await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      username: email.split("@")[0],
      full_name: fullName,
      role,
    });

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        username: email.split("@")[0],
        fullName,
        role,
        avatarUrl: null,
        phoneNumber: null,
        storeName: null,
        createdAt: data.user.created_at,
        password: "", // Dummy password for Supabase users
      },
      error: null,
    };
  }

  return { user: null, error: "Signup failed" };
}
