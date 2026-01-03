-- Fix Louvre Museum Image (Update to direct valid URL)
UPDATE activities
SET image_url = 'https://images.unsplash.com/photo-1565099824688-e93930dfa874?q=80&w=2070'
WHERE title ILIKE '%Louvre%';

-- Fix London City Image (If it exists and is broken)
UPDATE cities
SET image_url = 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070'
WHERE name = 'London';

-- Fix Colosseum Image (Ensure it has width param)
UPDATE activities
SET image_url = 'https://images.unsplash.com/photo-1552483775-55f909110ddf?q=80&w=2000'
WHERE title ILIKE '%Colosseum%';
