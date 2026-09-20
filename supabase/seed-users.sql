-- Seeder 4 Akun Role Modesy Marketplace untuk dieksekusi di Supabase SQL Editor
-- Superadmin, Moderator, Vendor, dan Member

INSERT INTO profiles (id, email, username, full_name, role, avatar_url, phone_number, store_name, created_at)
VALUES
  (
    'usr-superadmin-01',
    'superadmin@modesy.com',
    'superadmin',
    'Super Admin Modesy',
    'superadmin',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    '+62 812-0000-0001',
    NULL,
    NOW()
  ),
  (
    'usr-moderator-01',
    'moderator@modesy.com',
    'moderator',
    'Moderator Modesy',
    'moderator',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    '+62 812-0000-0002',
    NULL,
    NOW()
  ),
  (
    'usr-vendor-01',
    'vendor@modesy.com',
    'techvendor',
    'Modesy Tech Store',
    'vendor',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    '+62 812-0000-0003',
    'Modesy Official Store',
    NOW()
  ),
  (
    'usr-member-01',
    'member@modesy.com',
    'johndoe',
    'John Doe Member',
    'member',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    '+62 812-0000-0004',
    NULL,
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  avatar_url = EXCLUDED.avatar_url,
  phone_number = EXCLUDED.phone_number,
  store_name = EXCLUDED.store_name;

