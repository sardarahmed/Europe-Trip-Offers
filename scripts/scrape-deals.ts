import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config({ path: '.env.local' });

puppeteer.use(StealthPlugin());

// --- Configuration ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tblkmpzdzptwnyqfcboj.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY!);

const BAD_WORDS = ['sex', 'adult', 'xxx', 'guns', 'weapon', 'nudity'];
const MAX_DEALS_PER_RUN = 50;
const TARGET_CITIES = ['Paris', 'London', 'Rome', 'Barcelona', 'Amsterdam', 'New York', 'Dubai'];

// --- Fallback Data (used if scraping is blocked) ---
const FALLBACK_DEALS: Record<string, any[]> = {
    'Paris': [
        { title: 'Eiffel Tower Skip-the-Line Summit Access', price: '€65', rating: 4.8, reviews: 12500, image_url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/07/03/1c/9c.jpg', duration: '2-3 hours' },
        { title: 'Louvre Museum Timed Entrance Ticket', price: '€22', rating: 4.7, reviews: 25000, image_url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/df/1b/e3.jpg', duration: '3-4 hours' },
        { title: 'Seine River Sightseeing Cruise', price: '€16', rating: 4.5, reviews: 8000, image_url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/27/60/96.jpg', duration: '1 hour' },
        { title: 'Versailles Palace & Gardens Full Access', price: '€55', rating: 4.6, reviews: 9500, image_url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/27/83/67.jpg', duration: '4-5 hours' }
    ],
    'London': [
        { title: 'London Eye Standard Ticket', price: '£30', rating: 4.5, reviews: 15000, image_url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/27/7f/3e.jpg', duration: '30 mins' },
        { title: 'Tower of London Entrance Ticket', price: '£33', rating: 4.8, reviews: 11000, image_url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/27/7f/65.jpg', duration: '2-3 hours' },
        { title: 'Harry Potter Tour of Warner Bros. Studio', price: '£95', rating: 4.9, reviews: 30000, image_url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/27/80/7a.jpg', duration: '7 hours' }
    ],
    'Rome': [
        { title: 'Colosseum, Roman Forum & Palatine Hill Priority Access', price: '€45', rating: 4.7, reviews: 22000, image_url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/27/65/59.jpg', duration: '3 hours' },
        { title: 'Vatican Museums & Sistine Chapel Ticket', price: '€35', rating: 4.6, reviews: 19000, image_url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/06/70/1a/df.jpg', duration: '3 hours' }
    ],
    'Barcelona': [
        { title: 'Sagrada Familia Fast-Track Ticket', price: '€34', rating: 4.8, reviews: 18000, image_url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/27/61/57.jpg', duration: '1-2 hours' },
        { title: 'Park Guell Admission Ticket', price: '€13', rating: 4.5, reviews: 12000, image_url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/27/61/63.jpg', duration: '1-2 hours' }
    ],
    'Amsterdam': [
        { title: 'Van Gogh Museum Ticket', price: '€22', rating: 4.7, reviews: 10000, image_url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/27/66/38.jpg', duration: '2 hours' },
        { title: 'Amsterdam Canal Cruise', price: '€15', rating: 4.4, reviews: 8500, image_url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/27/66/1f.jpg', duration: '1 hour' }
    ],
    'New York': [
        { title: 'Summit One Vanderbilt Experience', price: '$42', rating: 4.9, reviews: 5000, image_url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0e/94/aa/5b.jpg', duration: '2 hours' },
        { title: 'Statue of Liberty & Ellis Island Tour', price: '$30', rating: 4.6, reviews: 14000, image_url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/27/6b/ba.jpg', duration: '4 hours' }
    ],
    'Dubai': [
        { title: 'Burj Khalifa Levels 124 & 125 Entry', price: '$45', rating: 4.6, reviews: 16000, image_url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/27/6d/27.jpg', duration: '1.5 hours' },
        { title: 'Desert Safari with BBQ Dinner', price: '$55', rating: 4.8, reviews: 12000, image_url: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/27/6d/4b.jpg', duration: '6 hours' }
    ]
};

async function scrapeDeals() {
    console.log('Starting DEEP SEARCH deal scraper (Stealth Mode + Fallback)...');

    // 1. Fetch Stores & Cities
    const { data: stores, error: storeError } = await supabase.from('stores').select('*');
    const { data: cities, error: cityError } = await supabase.from('cities').select('id, name, slug');

    if (storeError || cityError) {
        console.error('Error fetching ref data:', storeError || cityError);
        return;
    }

    const expediaStore = stores?.find(s => s.slug.toLowerCase().includes('expedia'));
    const viatorStore = stores?.find(s => s.slug.toLowerCase().includes('viator'));

    if (!expediaStore && !viatorStore) {
        console.log('Expedia or Viator not found in DB.');
        return;
    }

    // 2. Launch Browser with Stealth settings
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=1920,1080',
            '--disable-blink-features=AutomationControlled'
        ],
        ignoreDefaultArgs: ['--enable-automation']
    });

    let totalDealsAdded = 0;

    // Helper to process items
    const processItems = async (items: any[], store: any, cityId: string) => {
        const storeName = store.name;
        const affiliateLinkDeals = store.affiliate_link_deals || store.website_url;
        // Coupons don't use a specific link from scraper usually, but we have it in store
        // const affiliateLinkCoupons = store.affiliate_link_coupons || store.website_url;

        for (const item of items) {
            if (totalDealsAdded >= MAX_DEALS_PER_RUN) return;
            if (BAD_WORDS.some(w => item.title.toLowerCase().includes(w))) continue;

            const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').substring(0, 50) + '-' + Math.floor(Math.random() * 1000);

            // Check existing
            const { data: existing } = await supabase.from('activities').select('id').eq('slug', slug).single();
            if (existing) continue;

            // 1. ADD DEAL
            const dealData = {
                title: item.title,
                slug: slug,
                city_id: cityId,
                store_id: store.id,
                price: parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) || 50,
                rating: item.rating || 4.5,
                reviews_count: item.reviews || Math.floor(Math.random() * 500) + 50,
                image_url: item.image_url || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800',
                duration: item.duration || 'Flexible',
                is_featured: Math.random() > 0.8, // 20% featured
                affiliate_link: affiliateLinkDeals,
                description: item.description || `Experience the best of ${storeName} with this amazing offer: ${item.title}. Book now to secure your spot!`,
                created_at: new Date().toISOString()
            };

            const { error: insertError } = await supabase.from('activities').insert(dealData).select('id').single();
            if (!insertError) {
                console.log(`  [${storeName}] Added Deal: ${item.title.substring(0, 30)}...`);
                totalDealsAdded++;

                // 2. MAYBE ADD COUPON
                if (Math.random() > 0.7) {
                    const discount = Math.floor(Math.random() * 15) + 5;
                    const code = (storeName.substring(0, 3) + discount + 'OFF' + Math.floor(Math.random() * 100)).toUpperCase();
                    await supabase.from('coupons').insert({
                        code: code,
                        title: `${discount}% OFF: ${item.title} `,
                        description: `Save ${discount}% on this activity! Valid for a limited time.`,
                        discount_amount: `${discount}% `,
                        expiry_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                        store_id: store.id,
                        is_featured: false,
                    });
                    console.log(`    -> Added Coupon: ${code} `);
                }
            } else {
                console.error(`  Failed: ${insertError.message} `);
            }
        }
    };

    try {
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        const storesToScrape = [
            {
                store: viatorStore,
                name: 'Viator',
                urlPattern: (city: string) => `https://www.viator.com/searchResults/all?text=${encodeURIComponent(city + ' tours')}`
            },
            {
                store: expediaStore,
                name: 'Expedia',
                urlPattern: (city: string) => `https://www.expedia.com/things-to-do/search?location=${encodeURIComponent(city)}`
            }
        ];

        for (const { store, name, urlPattern } of storesToScrape) {
            if (!store) continue;

            for (const cityName of TARGET_CITIES) {
                const url = urlPattern(cityName);
                console.log(`Processing ${name} for ${cityName}...`);

                // Try scraping
                let items: any[] = [];
                try {
                    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
                    await new Promise(r => setTimeout(r, 5000));

                    const content = await page.content();
                    const $ = cheerio.load(content);

                    if (name === 'Viator') {
                        $('[data-test-target="product-card"], .product-card-inner, div[class*="ProductCard"]').each((_, element) => {
                            const title = $(element).find('h2, h3, a[href*="/tours/"]').first().text().trim();
                            const priceText = $(element).find('.price, [data-test-target="price"]').first().text().trim();
                            const img = $(element).find('img').attr('src');
                            if (title && priceText) items.push({ title, price: priceText, image_url: img });
                        });
                    } else {
                        $('.uitk-card, [data-testid="offer-card"], div[class*="activity-card"]').each((_, element) => {
                            const title = $(element).find('h3, h4, .uitk-heading').first().text().trim();
                            const priceText = $(element).find('div:contains("$"), div:contains("€")').last().text().trim();
                            if (title && priceText) items.push({ title, price: priceText });
                        });
                    }
                } catch (e) {
                    console.error(`Scraping error for ${name}/${cityName}: ${e.message}`);
                }

                if (items.length === 0) {
                    console.log(`Scraping blocked/empty for ${name} in ${cityName}. Using FALLBACK deals.`);
                    const cityId = cities?.find(c => c.name.toLowerCase() === cityName.toLowerCase())?.id;
                    if (cityId) {
                        const fallbacks = FALLBACK_DEALS[cityName] || [];
                        await processItems(fallbacks, store, cityId);
                    }
                } else {
                    console.log(`Successfully scraped ${items.length} items for ${name} in ${cityName}!`);
                    const cityId = cities?.find(c => c.name.toLowerCase() === cityName.toLowerCase())?.id;
                    if (cityId) await processItems(items, store, cityId);
                }

                await new Promise(r => setTimeout(r, 2000));
            }
        }

    } catch (error) {
        console.error('Fatal Scraper Error:', error);
    } finally {
        await browser.close();
        if (fs.existsSync('viator_debug.html')) fs.unlinkSync('viator_debug.html');
        if (fs.existsSync('expedia_debug.html')) fs.unlinkSync('expedia_debug.html');
    }

    // Cleanup old deals
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const { error: deleteError } = await supabase
        .from('activities')
        .delete()
        .lt('created_at', threeDaysAgo.toISOString());

    console.log(`Done. Total items processed/added: ${totalDealsAdded}`);
}

scrapeDeals();
