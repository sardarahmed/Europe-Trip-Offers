-- Add custom fields to stores table for UI enhancements
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS custom_discount_text text,
ADD COLUMN IF NOT EXISTS used_deals_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS popup_code text,
ADD COLUMN IF NOT EXISTS popup_link text;
