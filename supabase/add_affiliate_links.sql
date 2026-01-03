-- Add Affiliate Links to Activities

-- 1. Louvre Museum
UPDATE activities
SET affiliate_link = 'https://www.viator.com/tours/Paris/Louvre-Museum-Skip-the-Line-Access-Guided-Tour/d479-6242LOUVRE'
WHERE slug = 'louvre-museum-ticket';

-- 2. Colosseum Tour
UPDATE activities
SET affiliate_link = 'https://www.viator.com/tours/Rome/Skip-the-Line-Colosseum-official-guided-tour/d511-13760P2'
WHERE slug = 'colosseum-tour';

-- 3. London Eye (Example)
UPDATE activities
SET affiliate_link = 'https://www.viator.com/tours/London/The-London-Eye/d737-2342EYE'
WHERE slug = 'london-eye';
