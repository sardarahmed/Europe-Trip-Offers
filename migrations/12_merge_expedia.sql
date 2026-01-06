DO $$
DECLARE
    keep_id UUID;
    delete_id UUID;
BEGIN
    -- 1. Identify the Expedias
    -- We assume the NEWER one is the one the User added and wants to keep.
    -- We assume the OLDER one is the one the System added.
    SELECT id INTO keep_id FROM stores WHERE name ILIKE 'Expedia' ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO delete_id FROM stores WHERE name ILIKE 'Expedia' ORDER BY created_at ASC LIMIT 1;

    -- Safety check: Ensure we have two different IDs
    IF keep_id IS NOT NULL AND delete_id IS NOT NULL AND keep_id != delete_id THEN
        
        -- 2. Move any linked data from Old Store to New Store
        -- Update Coupons
        UPDATE coupons SET store_id = keep_id WHERE store_id = delete_id;
        
        -- Update Activities
        UPDATE activities SET store_id = keep_id WHERE store_id = delete_id;

        -- 3. Delete the Old Store
        DELETE FROM stores WHERE id = delete_id;
        
        RAISE NOTICE 'Merged duplicate Expedia stores. Kept newest (ID: %) and deleted oldest (ID: %).', keep_id, delete_id;
    ELSE
        RAISE NOTICE 'No duplicate Expedia stores found to merge.';
    END IF;
END $$;
