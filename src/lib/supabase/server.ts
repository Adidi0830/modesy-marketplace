import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://noqapyqgjniunizkdicv.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vcWFweXFnam5pdW5pemtkaWN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODM3NjM3MSwiZXhwIjoyMTAzOTUyMzcxfQ.k4BKq3N2NsPBCob_xER1BLrdkSwoH54WAsmpe1sShJw";

export const isSupabaseAdminConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseServiceKey) &&
    supabaseUrl !== "https://your-project.supabase.co"
  );
};

let supabaseAdminInstance: SupabaseClient | null = null;

export const getSupabaseAdmin = (): SupabaseClient | null => {
  if (!isSupabaseAdminConfigured()) {
    return null;
  }
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseAdminInstance;
};