-- Migration: Add missing columns to profiles table
-- Run this in Supabase SQL Editor

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('superadmin', 'moderator', 'vendor', 'member')),
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS store_name TEXT;

-- Update existing rows
UPDATE profiles 
SET username = COALESCE(username, split_part(email, '@', 1)),
    full_name = COALESCE(full_name, 'User'),
    role = COALESCE(role, 'member')
WHERE username IS NULL OR full_name IS NULL OR role IS NULL;

-- Create unique index on username if not exists
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique ON profiles(username) WHERE username IS NOT NULL;