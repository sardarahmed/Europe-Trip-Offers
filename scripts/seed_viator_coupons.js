const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const VIATOR_ID = 'c8107980-f88b-406e-980d-f988bf91697d';
const AFFILIATE_LINK = 'https://vi.me/EWss4';

const couponData = [
    {
        category: 'Hotel & Stays',
        coupons: [
            { title: 'Stay in the heart of Paris – Get 20% OFF on luxury hotels near the Eiffel Tower.', discount: '20% OFF' },
            { title: 'Paris Hotel Deal – Save 25% on premium stays close to the Louvre Museum.', discount: '25% OFF' },
            { title: 'Romantic Paris Escape – Enjoy exclusive hotel discounts near the Seine River.', discount: 'Special Discount' }
        ]
    },
    {
        category: 'Museum Offers',
        coupons: [
            { title: 'Discover art and history – Get 20% OFF museum tours at the famous Louvre Museum.', discount: '20% OFF' },
            { title: 'Explore masterpieces with special discounts at Musée d\'Orsay.', discount: 'Special Discount' },
            { title: 'Paris Culture Deal – Save on entry tickets and guided tours at top museums.', discount: 'Entry Deals' }
        ]
    },
    {
        category: 'Palaces & Historic Places',
        coupons: [
            { title: 'Experience royal history – Enjoy special deals for visits to the magnificent Palace of Versailles.', discount: 'Royal Deal' },
            { title: 'Discover French royalty with discounted tours of the iconic Grand Trianon.', discount: 'Special Offer' }
        ]
    },
    {
        category: 'Famous Tourist Spots',
        coupons: [
            { title: 'Paris Top Attractions Sale – Save 20% on experiences around the Arc de Triomphe.', discount: '20% OFF' },
            { title: 'Explore the romantic streets of Montmartre with exclusive discounts.', discount: 'Exclusive Deal' },
            { title: 'Visit historic Paris with special deals near Notre-Dame Cathedral.', discount: 'Special Deal' }
        ]
    },
    {
        category: 'Food & Restaurant Offers',
        coupons: [
            { title: 'Taste authentic French cuisine – Enjoy restaurant deals near the Champs-Élysées.', discount: 'Food Deal' },
            { title: 'Paris Food Experience – Special dining discounts near the Latin Quarter.', discount: 'Dining Offer' }
        ]
    },
    {
        category: 'Mixed Paris Deals',
        coupons: [
            { title: 'Paris Travel Deal – Save on hotels, museums, restaurants, and city tours.', discount: 'Bundle Save' },
            { title: 'Explore the best of Paris with exclusive discounts on top attractions and experiences.', discount: 'Exclusive Savings' },
            { title: 'Paris City Pass Offer – Enjoy special savings on museums, monuments, and guided tours.', discount: 'City Pass Deal' }
        ]
    }
];

async function seed() {
    console.log('Starting Viator Coupon Seeding...');

    for (const group of couponData) {
        // 1. Get or Create Category
        let categoryId;
        const slug = group.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]/g, '');
        
        const { data: existingCat } = await supabase
            .from('categories')
            .select('id')
            .eq('name', group.category)
            .eq('type', 'coupon')
            .single();

        if (existingCat) {
            categoryId = existingCat.id;
        } else {
            const { data: newCat, error: catErr } = await supabase
                .from('categories')
                .insert([{ name: group.category, slug, type: 'coupon' }])
                .select()
                .single();
            
            if (catErr) {
                console.error(`Error creating category ${group.category}:`, catErr.message);
                continue;
            }
            categoryId = newCat.id;
            console.log(`Created Category: ${group.category}`);
        }

        // 2. Insert Coupons
        for (const coupon of group.coupons) {
            // Check if exists
            const { data: existingCoupon } = await supabase
                .from('coupons')
                .select('id')
                .eq('title', coupon.title)
                .single();

            if (existingCoupon) {
                console.log(`Skipping existing coupon: ${coupon.title}`);
                continue;
            }

            const { error: insErr } = await supabase
                .from('coupons')
                .insert([{
                    title: coupon.title,
                    discount_amount: coupon.discount,
                    category_id: categoryId,
                    store_id: VIATOR_ID,
                    affiliate_link: AFFILIATE_LINK,
                    type: 'deal',
                    description: `Experience the best of Paris with this exclusive offer from Viator. ${coupon.title}`,
                    is_featured: true,
                    used_count: Math.floor(Math.random() * 200) + 50,
                    success_rate: Math.floor(Math.random() * 5) + 95
                }]);

            if (insErr) {
                console.error(`Error inserting coupon ${coupon.title}:`, insErr.message);
            } else {
                console.log(`Added Coupon: ${coupon.title}`);
            }
        }
    }

    console.log('Seeding Complete!');
}

seed();
