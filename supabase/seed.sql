-- Insert Categories
INSERT INTO categories (id, name, slug, type) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Historic Capitals', 'historic-capitals', 'city'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Coastal Escapes', 'coastal-escapes', 'city'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Museums & Art', 'museums-art', 'activity'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b23', 'Food & Drink', 'food-drink', 'activity'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'Seasonal Offers', 'seasonal-offers', 'coupon'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c34', 'Last Minute', 'last-minute', 'coupon');

-- Insert Hero Content
INSERT INTO hero_content (page_slug, title, subtitle, background_image_url) VALUES
('home', 'Discover the Best Europe Travel Deals', 'Explore top-rated tours, exclusive coupons, and hidden gems across Europe. Powered by Viator.', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070');

-- Insert Navbar Settings
INSERT INTO navbar_settings (cta_text, cta_link) VALUES
('Get 20% OFF', '/coupons');

-- Insert Cities (Linked to Categories)
INSERT INTO cities (id, name, slug, country, description, image_url, featured, activity_count, category_id) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'Paris', 'paris', 'France', 'The City of Light.', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80', true, 150, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d45', 'Rome', 'rome', 'Italy', 'The Eternal City.', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80', true, 120, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d46', 'Barcelona', 'barcelona', 'Spain', 'Architecture and Beach.', 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80', true, 95, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12');

-- Insert Activities (Linked to Categories and Cities)
INSERT INTO activities (id, city_id, category_id, title, slug, description, price, discount_price, rating, reviews_count, image_url, duration, is_featured) VALUES
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e55', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Louvre Museum Skip-the-Line', 'louvre-museum-ticket', 'World famous museum.', 65.00, 55.00, 4.8, 1200, 'https://images.unsplash.com/photo-1565099824688-e93930dfa874?q=80', '2.5 hours', true),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e56', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d45', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Colosseum Tour', 'colosseum-tour', 'Ancient gladiator arena.', 55.00, 49.00, 4.9, 3000, 'https://images.unsplash.com/photo-1552483775-55f909110ddf?q=80', '3 hours', true);

-- Insert Coupons
INSERT INTO coupons (id, category_id, code, title, discount_amount, expiry_date, image_url, is_featured) VALUES
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f66', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'PARIS10', '10% OFF Paris Tours', '10% OFF', '2025-12-31', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80', true),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f67', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c34', 'SUMMER25', '€25 OFF Summer Bookings', '€25 OFF', '2025-08-31', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80', true);
