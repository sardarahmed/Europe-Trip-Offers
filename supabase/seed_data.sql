-- 0. Schema Updates (Ensure columns exist first)
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS used_count INTEGER DEFAULT 0;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS success_rate INTEGER DEFAULT 100;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS last_verified TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS terms TEXT;

-- 1. Insert Initial Stores
INSERT INTO stores (name, slug, logo_url, description, is_featured, rating) VALUES
('Expedia', 'expedia', 'https://upload.wikimedia.org/wikipedia/commons/7/73/Expedia_logo_2023.svg', 'Leading full-service online travel brand.', true, 4.5),
('Booking.com', 'booking-com', 'https://upload.wikimedia.org/wikipedia/commons/b/be/Booking.com_logo.svg', 'Earth''s #1 accommodation site.', true, 4.8),
('Viator', 'viator', 'https://upload.wikimedia.org/wikipedia/commons/3/30/Viator_Logo_2024.svg', 'Find and book the best things to do.', true, 4.6),
('Airbnb', 'airbnb', 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg', 'Unique homes and experiences.', true, 4.7),
('GetYourGuide', 'getyourguide', 'https://upload.wikimedia.org/wikipedia/commons/7/75/GetYourGuide_logo_2020.svg', 'Book tickets for top attractions.', true, 4.6),
('TripAdvisor', 'tripadvisor', 'https://upload.wikimedia.org/wikipedia/commons/0/02/TripAdvisor_Logo.svg', 'World''s largest travel platform.', true, 4.5)
ON CONFLICT (slug) DO NOTHING;

-- 2. Backfill Coupon Stats (Metrics)
UPDATE coupons 
SET 
  used_count = floor(random() * 4950 + 50)::int,
  success_rate = floor(random() * 15 + 85)::int,
  last_verified = NOW() - (floor(random() * 24) || ' hours')::interval
WHERE used_count = 0;

-- 3. Link Test Data (Example - Optional)
-- This ensures at least one featured coupon has a store
UPDATE coupons
SET store_id = (SELECT id FROM stores WHERE name ILIKE '%Expedia%' LIMIT 1)
WHERE id IN (
  SELECT id FROM coupons 
  WHERE is_featured = true AND store_id IS NULL 
  LIMIT 1
);
