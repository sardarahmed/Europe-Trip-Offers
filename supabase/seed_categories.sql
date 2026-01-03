-- Bulk Insert Categories for Europe Trip Offers
-- Types: 'activity', 'city', 'coupon', 'blog'
-- Uses ON CONFLICT DO NOTHING to skip categories that already exist (like 'museums-art')

INSERT INTO categories (name, slug, type) VALUES
-- Activity Categories (Tours & Experiences)
('City Tours', 'city-tours', 'activity'),
('Museums & Art', 'museums-art', 'activity'),
('Food & Drink', 'food-drink', 'activity'),
('Day Trips', 'day-trips', 'activity'),
('Outdoor Activities', 'outdoor-activities', 'activity'),
('Cruises & Boat Tours', 'cruises-boat-tours', 'activity'),
('Walking Tours', 'walking-tours', 'activity'),
('Historical Sites', 'historical-sites', 'activity'),
('Private Tours', 'private-tours', 'activity'),
('Nightlife', 'nightlife', 'activity'),
('Shopping', 'shopping', 'activity'),
('Theme Parks', 'theme-parks', 'activity'),
('Classes & Workshops', 'classes-workshops', 'activity'),
('Concerts & Shows', 'concerts-shows', 'activity'),
('Sports', 'sports', 'activity'),
('Nature & Wildlife', 'nature-wildlife', 'activity'),
('Photography Tours', 'photography-tours', 'activity'),
('Wine Tasting', 'wine-tasting', 'activity'),
('Bike Tours', 'bike-tours', 'activity'),
('Bus Tours', 'bus-tours', 'activity'),
('Luxury Tours', 'luxury-tours', 'activity'),
('Family Friendly', 'family-friendly', 'activity'),
('Romantic', 'romantic', 'activity'),
('Adventure', 'adventure', 'activity'),

-- City Categories (Types of Destinations)
('Historic Capitals', 'historic-capitals', 'city'),
('Coastal Towns', 'coastal-towns', 'city'),
('Islands', 'islands', 'city'),
('Mountain Resorts', 'mountain-resorts', 'city'),
('Hidden Gems', 'hidden-gems', 'city'),
('Romantic Getaways', 'romantic-getaways', 'city'),
('Budget Friendly', 'budget-friendly', 'city'),
('Luxury Destinations', 'luxury-destinations', 'city'),

-- Coupon Categories
('Seasonal Sale', 'seasonal-sale', 'coupon'),
('Black Friday', 'black-friday', 'coupon'),
('Last Minute', 'last-minute', 'coupon'),
('Early Bird', 'early-bird', 'coupon'),
('Holiday Specials', 'holiday-specials', 'coupon'),
('Student Discount', 'student-discount', 'coupon'),
('Family Deals', 'family-deals', 'coupon'),

-- Blog Categories
('Travel Guides', 'travel-guides', 'blog'),
('Tips & Tricks', 'tips-tricks', 'blog'),
('Itineraries', 'itineraries', 'blog'),
('Food Guides', 'food-guides', 'blog'),
('Culture & History', 'culture-history', 'blog'),
('Budget Tips', 'budget-tips', 'blog')

ON CONFLICT (slug) DO NOTHING;
