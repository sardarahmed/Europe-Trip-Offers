-- Allow authenticated (anon) users to INSERT, UPDATE, DELETE on admin tables
-- Note: Security is handled by the Next.js Middleware which protects the Admin Pages.

-- CITIES
CREATE POLICY "Enable insert for anon users" ON cities FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for anon users" ON cities FOR UPDATE USING (true);
CREATE POLICY "Enable delete for anon users" ON cities FOR DELETE USING (true);

-- ACTIVITIES
CREATE POLICY "Enable insert for anon users" ON activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for anon users" ON activities FOR UPDATE USING (true);
CREATE POLICY "Enable delete for anon users" ON activities FOR DELETE USING (true);

-- COUPONS
CREATE POLICY "Enable insert for anon users" ON coupons FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for anon users" ON coupons FOR UPDATE USING (true);
CREATE POLICY "Enable delete for anon users" ON coupons FOR DELETE USING (true);

-- POSTS (Blog)
CREATE POLICY "Enable insert for anon users" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for anon users" ON posts FOR UPDATE USING (true);
CREATE POLICY "Enable delete for anon users" ON posts FOR DELETE USING (true);

-- HERO CONTENT & NAVBAR
CREATE POLICY "Enable insert for anon users" ON hero_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for anon users" ON hero_content FOR UPDATE USING (true);

CREATE POLICY "Enable insert for anon users" ON navbar_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for anon users" ON navbar_settings FOR UPDATE USING (true);
