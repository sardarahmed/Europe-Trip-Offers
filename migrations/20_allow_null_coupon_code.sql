-- Allow coupon codes to be null for 'deal' type offers
ALTER TABLE coupons ALTER COLUMN code DROP NOT NULL;
