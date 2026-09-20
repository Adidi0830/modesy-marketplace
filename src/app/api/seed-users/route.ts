import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const DEMO_USERS = [
  {
    id: "usr-superadmin-01",
    email: "superadmin@modesy.com",
    username: "superadmin",
    full_name: "Super Admin Modesy",
    role: "superadmin",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    phone_number: "+62 812-0000-0001",
    store_name: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "usr-moderator-01",
    email: "moderator@modesy.com",
    username: "moderator",
    full_name: "Moderator Modesy",
    role: "moderator",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    phone_number: "+62 812-0000-0002",
    store_name: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "usr-vendor-01",
    email: "vendor@modesy.com",
    username: "techvendor",
    full_name: "Modesy Tech Store",
    role: "vendor",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    phone_number: "+62 812-0000-0003",
    store_name: "Modesy Official Store",
    created_at: new Date().toISOString(),
  },
  {
    id: "usr-member-01",
    email: "member@modesy.com",
    username: "johndoe",
    full_name: "John Doe Member",
    role: "member",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    phone_number: "+62 812-0000-0004",
    store_name: null,
    created_at: new Date().toISOString(),
  },
];

export async function POST() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase admin client not configured. Set SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(DEMO_USERS, { onConflict: "id" })
      .select();

    if (error) {
      console.error("Error seeding users:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${data?.length || 0} demo users`,
      users: data,
    });
  } catch (err) {
    console.error("Unexpected error seeding users:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}