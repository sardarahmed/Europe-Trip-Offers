-- Add affiliate_link column to coupons table
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS affiliate_link TEXT;
