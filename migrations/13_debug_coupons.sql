-- Check if there are any Coupons left in the DB
SELECT id, code, title, is_featured FROM coupons;

-- Check if there are related Comparison Items that might be rendering? No, user said coupons.

-- To be super sure, let's select ALL from coupons
SELECT count(*) FROM coupons;
