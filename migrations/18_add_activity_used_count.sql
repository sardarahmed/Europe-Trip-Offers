-- Add used_count to activities table to allow admin manual control
ALTER TABLE activities
ADD COLUMN IF NOT EXISTS used_count integer DEFAULT 0;
