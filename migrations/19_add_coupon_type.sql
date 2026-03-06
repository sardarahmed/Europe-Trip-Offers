-- Add `type` column to coupons to allow differentiating between code and direct deals
ALTER TABLE coupons
ADD COLUMN IF NOT EXISTS type text DEFAULT 'code';
