-- Delete all stores EXCEPT Viator and Expedia
-- Uses ILIKE for case-insensitive matching to be safe
DELETE FROM stores 
WHERE name NOT ILIKE 'Viator' 
  AND name NOT ILIKE 'Expedia';
