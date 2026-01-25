-- Allow Service Role to do anything
CREATE POLICY "Enable all for service role" ON stores
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Repeat for cities
CREATE POLICY "Enable all for service role" ON cities
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Repeat for activities
CREATE POLICY "Enable all for service role" ON activities
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Repeat for coupons
CREATE POLICY "Enable all for service role" ON coupons
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
