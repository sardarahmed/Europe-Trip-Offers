-- Allow anonymous and authenticated users to perform all operations (insert, update, delete)
-- on the core tables. This is necessary because the frontend uses the public ANON key.

-- Admin/Stores
CREATE POLICY "Enable ALL for anon" ON stores
    FOR ALL
    USING (auth.role() = 'anon' OR auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'anon' OR auth.role() = 'authenticated');

-- Cities
CREATE POLICY "Enable ALL for anon" ON cities
    FOR ALL
    USING (auth.role() = 'anon' OR auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'anon' OR auth.role() = 'authenticated');

-- Activities
CREATE POLICY "Enable ALL for anon" ON activities
    FOR ALL
    USING (auth.role() = 'anon' OR auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'anon' OR auth.role() = 'authenticated');

-- Coupons
CREATE POLICY "Enable ALL for anon" ON coupons
    FOR ALL
    USING (auth.role() = 'anon' OR auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'anon' OR auth.role() = 'authenticated');
