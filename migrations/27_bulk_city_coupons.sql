-- Bulk Add City-Specific Coupons for Viator
-- Viator ID: c8107980-f88b-406e-980d-f988bf91697d

INSERT INTO coupons (title, discount_amount, category_id, city_id, store_id, affiliate_link, type, description, is_featured, used_count, success_rate)
SELECT 
    t.title, 
    t.discount, 
    cat.id, 
    cit.id, 
    'c8107980-f88b-406e-980d-f988bf91697d', 
    'https://vi.me/EWss4', 
    'deal', 
    'Discover the best of ' || cit.name || ' with this exclusive Viator offer. ' || t.title,
    true,
    floor(random() * 150) + 30,
    floor(random() * 5) + 94
FROM (VALUES 
    -- Barcelona
    ('Barcelona Special Deal – Get 20% OFF tours near the iconic Sagrada Família.', '20% OFF', 'Famous Tourist Spots', 'Barcelona'),
    ('Stay in central Barcelona with exclusive hotel discounts near La Rambla.', 'Hotel Deal', 'Hotel & Stays', 'Barcelona'),
    ('Discover art and architecture with special offers at Park Güell.', 'Special Offer', 'Museum Offers', 'Barcelona'),
    ('Barcelona City Experience – Save 20% on attractions around Casa Batlló.', '20% OFF', 'Famous Tourist Spots', 'Barcelona'),
    ('Explore Barcelona beaches and enjoy exclusive deals near Barceloneta Beach.', 'Beach Deal', 'Famous Tourist Spots', 'Barcelona'),
    
    -- London
    ('London Travel Deal – Save 20% on experiences near the famous Big Ben.', '20% OFF', 'Famous Tourist Spots', 'London'),
    ('Luxury London Stay – Hotel discounts near Buckingham Palace.', 'Hotel Deal', 'Hotel & Stays', 'London'),
    ('Discover British history with deals at the British Museum.', 'Special Offer', 'Museum Offers', 'London'),
    ('London Sightseeing Sale – Enjoy special offers near London Eye.', 'Sightseeing Sale', 'Famous Tourist Spots', 'London'),
    ('Shop and dine with exclusive deals around Oxford Street.', 'Shopping/Dining', 'Food & Restaurant Offers', 'London'),
    
    -- Milan
    ('Milan City Offer – Get 20% OFF tours near the beautiful Milan Cathedral.', '20% OFF', 'Famous Tourist Spots', 'Milan'),
    ('Luxury Milan Hotel Deals near Galleria Vittorio Emanuele II.', 'Hotel Deal', 'Hotel & Stays', 'Milan'),
    ('Discover art in Milan with special offers near Santa Maria delle Grazie.', 'Art Deal', 'Museum Offers', 'Milan'),
    ('Milan Fashion Experience – Exclusive discounts around Quadrilatero della Moda.', 'Fashion Deal', 'Famous Tourist Spots', 'Milan'),
    ('Explore Milan history with deals near Sforza Castle.', 'History Deal', 'Palaces & Historic Places', 'Milan'),
    
    -- Rome
    ('Rome Travel Deal – Save 20% on tours near the historic Colosseum.', '20% OFF', 'Famous Tourist Spots', 'Rome'),
    ('Rome Hotel Offers – Stay close to the stunning Trevi Fountain.', 'Hotel Deal', 'Hotel & Stays', 'Rome'),
    ('Discover ancient history with special offers near Roman Forum.', 'History Offer', 'Palaces & Historic Places', 'Rome'),
    ('Explore Vatican treasures with deals near St. Peter''s Basilica.', 'Vatican Deal', 'Museum Offers', 'Rome'),
    ('Rome City Experience – Save on attractions near the Pantheon.', 'City Deal', 'Famous Tourist Spots', 'Rome'),
    
    -- New York
    ('New York City Deal – Save 20% on experiences near Times Square.', '20% OFF', 'Famous Tourist Spots', 'New York City'),
    ('NYC Hotel Offers – Stay close to the famous Central Park.', 'Hotel Deal', 'Hotel & Stays', 'New York City'),
    ('Discover art and culture with deals at the Metropolitan Museum of Art.', 'Art/Culture', 'Museum Offers', 'New York City'),
    ('New York Sightseeing Sale – Explore attractions near Statue of Liberty.', 'Sightseeing Sale', 'Famous Tourist Spots', 'New York City'),
    ('NYC Entertainment Deals – Save on experiences around Broadway Theatre District.', 'Entertainment', 'Famous Tourist Spots', 'New York City')
) AS t(title, discount, category_name, city_name)
JOIN categories cat ON cat.name = t.category_name AND cat.type = 'coupon'
JOIN cities cit ON cit.name = t.city_name
WHERE NOT EXISTS (
    SELECT 1 FROM coupons co WHERE co.title = t.title
);
