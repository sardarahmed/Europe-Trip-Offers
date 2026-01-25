-- Drop policies if they exist to avoid conflict
DROP POLICY IF EXISTS "Enable all for service role" ON stores;
DROP POLICY IF EXISTS "Enable all for service role" ON cities;
DROP POLICY IF EXISTS "Enable all for service role" ON activities;
DROP POLICY IF EXISTS "Enable all for service role" ON coupons;

-- Recreate them to ensure they are correct
CREATE POLICY "Enable all for service role" ON stores
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Enable all for service role" ON cities
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Enable all for service role" ON activities
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Enable all for service role" ON coupons
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
