-- 11_add_coordinates_to_cities.sql

-- Add latitude and longitude columns
ALTER TABLE cities 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Populate with initial data for major featured cities
-- Paris
UPDATE cities SET latitude = 48.8566, longitude = 2.3522 WHERE slug = 'paris';
-- London
UPDATE cities SET latitude = 51.5074, longitude = -0.1278 WHERE slug = 'london';
-- Rome
UPDATE cities SET latitude = 41.9028, longitude = 12.4964 WHERE slug = 'rome';
-- Amsterdam
UPDATE cities SET latitude = 52.3676, longitude = 4.9041 WHERE slug = 'amsterdam';
-- Barcelona
UPDATE cities SET latitude = 41.3851, longitude = 2.1734 WHERE slug = 'barcelona';
-- Dubai
UPDATE cities SET latitude = 25.2048, longitude = 55.2708 WHERE slug = 'dubai';
-- New York
UPDATE cities SET latitude = 40.7128, longitude = -74.0060 WHERE slug = 'new-york';
-- Tokyo
UPDATE cities SET latitude = 35.6762, longitude = 139.6503 WHERE slug = 'tokyo';

-- Index for geospatial queries (optional but good for performance if using PostGIS later, strictly standard index for now)
CREATE INDEX IF NOT EXISTS idx_cities_lat_long ON cities (latitude, longitude);
