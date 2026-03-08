-- 1. Ensure Categories RLS is enabled for anon
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'categories' AND policyname = 'Enable ALL for anon'
    ) THEN
        CREATE POLICY "Enable ALL for anon" ON categories
            FOR ALL
            USING (auth.role() = 'anon' OR auth.role() = 'authenticated')
            WITH CHECK (auth.role() = 'anon' OR auth.role() = 'authenticated');
    END IF;
END $$;

-- 2. Add New Categories (Safe Insert)
INSERT INTO categories (name, slug, type)
SELECT name, slug, type
FROM (VALUES 
    ('Hotel & Stays', 'hotel-stays', 'coupon'),
    ('Museum Offers', 'museum-offers', 'coupon'),
    ('Palaces & Historic Places', 'palaces-historic-places', 'coupon'),
    ('Famous Tourist Spots', 'famous-tourist-spots', 'coupon'),
    ('Food & Restaurant Offers', 'food-restaurant-offers', 'coupon'),
    ('Mixed Paris Deals', 'mixed-paris-deals', 'coupon')
) AS v(name, slug, type)
WHERE NOT EXISTS (
    SELECT 1 FROM categories c WHERE c.name = v.name AND c.type = v.type
);

-- 3. Add Coupons for Viator (Safe Insert)
-- Viator ID: c8107980-f88b-406e-980d-f988bf91697d

INSERT INTO coupons (title, discount_amount, category_id, store_id, affiliate_link, type, description, is_featured, used_count, success_rate)
SELECT 
    t.title, 
    t.discount, 
    c.id, 
    'c8107980-f88b-406e-980d-f988bf91697d', 
    'https://vi.me/EWss4', 
    'deal', 
    'Experience the best of Paris with this exclusive offer from Viator. ' || t.title,
    true,
    floor(random() * 200) + 50,
    floor(random() * 5) + 95
FROM (VALUES 
    ('Stay in the heart of Paris – Get 20% OFF on luxury hotels near the Eiffel Tower.', '20% OFF', 'Hotel & Stays'),
    ('Paris Hotel Deal – Save 25% on premium stays close to the Louvre Museum.', '25% OFF', 'Hotel & Stays'),
    ('Romantic Paris Escape – Enjoy exclusive hotel discounts near the Seine River.', 'Special Discount', 'Hotel & Stays'),
    ('Discover art and history – Get 20% OFF museum tours at the famous Louvre Museum.', '20% OFF', 'Museum Offers'),
    ('Explore masterpieces with special discounts at Musée d''Orsay.', 'Special Discount', 'Museum Offers'),
    ('Paris Culture Deal – Save on entry tickets and guided tours at top museums.', 'Entry Deals', 'Museum Offers'),
    ('Experience royal history – Enjoy special deals for visits to the magnificent Palace of Versailles.', 'Royal Deal', 'Palaces & Historic Places'),
    ('Discover French royalty with discounted tours of the iconic Grand Trianon.', 'Special Offer', 'Palaces & Historic Places'),
    ('Paris Top Attractions Sale – Save 20% on experiences around the Arc de Triomphe.', '20% OFF', 'Famous Tourist Spots'),
    ('Explore the romantic streets of Montmartre with exclusive discounts.', 'Exclusive Deal', 'Famous Tourist Spots'),
    ('Visit historic Paris with special deals near Notre-Dame Cathedral.', 'Special Deal', 'Famous Tourist Spots'),
    ('Taste authentic French cuisine – Enjoy restaurant deals near the Champs-Élysées.', 'Food Deal', 'Food & Restaurant Offers'),
    ('Paris Food Experience – Special dining discounts near the Latin Quarter.', 'Dining Offer', 'Food & Restaurant Offers'),
    ('Paris Travel Deal – Save on hotels, museums, restaurants, and city tours.', 'Bundle Save', 'Mixed Paris Deals'),
    ('Explore the best of Paris with exclusive discounts on top attractions and experiences.', 'Exclusive Savings', 'Mixed Paris Deals'),
    ('Paris City Pass Offer – Enjoy special savings on museums, monuments, and guided tours.', 'City Pass Deal', 'Mixed Paris Deals')
) AS t(title, discount, category_name)
JOIN categories c ON c.name = t.category_name AND c.type = 'coupon'
WHERE NOT EXISTS (
    SELECT 1 FROM coupons co WHERE co.title = t.title
);
