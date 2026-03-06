-- Add offer details to stores table for the new card UI
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS offer_title text,
ADD COLUMN IF NOT EXISTS offer_expiry text;
