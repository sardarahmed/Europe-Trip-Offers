-- Add affiliate link columns to stores table
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS affiliate_link_deals TEXT,
ADD COLUMN IF NOT EXISTS affiliate_link_coupons TEXT;
