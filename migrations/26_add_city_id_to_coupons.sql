-- Add city_id column to coupons table
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES cities(id);
