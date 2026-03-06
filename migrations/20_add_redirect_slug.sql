-- Add redirect_slug to stores
ALTER TABLE stores ADD COLUMN IF NOT EXISTS redirect_slug TEXT;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_stores_redirect_slug ON stores(redirect_slug);
