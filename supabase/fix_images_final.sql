-- 1. Fix Louvre Museum Image (Activity)
UPDATE activities
SET image_url = 'https://images.unsplash.com/photo-1560425946-7d5830202765?fm=jpg&q=60&w=3000'
WHERE slug = 'louvre-museum-ticket';

-- 2. Fix Colosseum Tour Image (Activity)
UPDATE activities
SET image_url = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?fm=jpg&q=60&w=3000'
WHERE slug = 'colosseum-tour';

-- 3. Fix London City Image (City)
UPDATE cities
SET image_url = 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?fm=jpg&q=60&w=3000'
WHERE slug = 'london';

-- 4. Fix London Eye (Activity - assuming it exists and might need it)
UPDATE activities
SET image_url = 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?fm=jpg&q=60&w=3000'
WHERE slug = 'london-eye';
