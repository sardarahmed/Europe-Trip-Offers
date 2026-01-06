-- 1. Delete all stores that are NOT Viator or Expedia
DELETE FROM stores 
WHERE name NOT ILIKE 'Viator' 
  AND name NOT ILIKE 'Expedia';

-- 2. Make sure Viator and Expedia are marked as "Featured" so they show up on the Homepage
UPDATE stores 
SET is_featured = true 
WHERE name ILIKE 'Viator' OR name ILIKE 'Expedia';
