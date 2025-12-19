-- Run this in your Supabase SQL Editor to add the new fields

ALTER TABLE contracts ADD COLUMN dni text;
ALTER TABLE contracts ADD COLUMN phone text;
ALTER TABLE contracts ADD COLUMN address text;
ALTER TABLE contracts ADD COLUMN iban text;
