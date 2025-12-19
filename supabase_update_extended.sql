-- Run this block in Supabase SQL Editor.
-- It will safely add the columns if they don't exist yet, and ignore them if they do.

ALTER TABLE contracts ADD COLUMN IF NOT EXISTS dni text;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS iban text;
