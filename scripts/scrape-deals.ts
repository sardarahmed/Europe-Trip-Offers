import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';
import { Store } from '@/types';
dotenv.config({ path: '.env.local' });

// --- Configuration ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tblkmpzdzptwnyqfcboj.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ZMUne72FC_KU4SdMikuPUQ_fxFNRzUz';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Needed for writing if RLS is strict

// Use service role if available for backend operations, otherwise anon (might fail RLS)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY || SUPABASE_KEY);

const BAD_WORDS = ['sex', 'adult', 'xxx', 'guns', 'weapon'];
const MAX_DEALS_PER_RUN = 100;
const MAX_COUPONS_PER_RUN = 100;

async function scrapeDeals() {
    console.log('Starting deal scraper...');

    // 1. Fetch Stores
    const { data: stores, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .not('website_url', 'is', null);

    if (storeError) {
        console.error('Error fetching stores:', storeError);
        return;
    }

    if (!stores || stores.length === 0) {
        console.log('No stores with URLs found.');
        return;
    }

    console.log(`Found ${stores.length} stores to check.`);

    // 2. Launch Browser
    const browser = await puppeteer.launch({
        headless: 'new', // new headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // helpful for CI
    });

    let totalDealsAdded = 0;
    let totalCouponsAdded = 0;

    for (const store of stores) {
        if (totalDealsAdded >= MAX_DEALS_PER_RUN && totalCouponsAdded >= MAX_COUPONS_PER_RUN) break;

        console.log(`\nProcessing ${store.name} (${store.website_url})...`);
        const affiliateLinkDeals = store.affiliate_link_deals || store.website_url;
        const affiliateLinkCoupons = store.affiliate_link_coupons || store.website_url // Fallback

        try {
            const page = await browser.newPage();
            // Block images/fonts to save bandwidth
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            await page.goto(store.website_url, { waitUntil: 'domcontentloaded', timeout: 30000 });

            // Get HTML for Cheerio (faster parsing)
            const content = await page.content();
            const $ = cheerio.load(content);
            await page.close();

            // 3. Generic Scraping Strategy
            // Look for common e-commerce patterns
            const scrapedItems: any[] = [];

            // Selector 1: Schema.org Product
            $('script[type="application/ld+json"]').each((_, el) => {
                try {
                    const json = JSON.parse($(el).html() || '{}');
                    if (json['@type'] === 'Product' || json['@type'] === 'Offer') {
                        scrapedItems.push({
                            title: json.name,
                            price: json.offers?.price || json.price,
                            image: json.image,
                            link: store.website_url // We use store link as base, specific logic below
                        });
                    }
                } catch (e) { } // ignore json parse errors
            });

            // Selector 2: Common visual classes (fallback)
            if (scrapedItems.length === 0) {
                // Try searching for generic elements
                $('[class*="product"], [class*="item"], [class*="card"]').each((_, el) => {
                    if (scrapedItems.length > 5) return; // Limit items per store per run
                    const title = $(el).find('h1, h2, h3, [class*="title"], [class*="name"]').first().text().trim();
                    const priceText = $(el).find('[class*="price"]').first().text().trim();
                    const img = $(el).find('img').first().attr('src');

                    if (title && priceText && title.length > 5 && title.length < 100) {
                        // Extract number from price
                        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
                        if (!isNaN(price) && price > 0) {
                            scrapedItems.push({ title, price, image: img });
                        }
                    }
                });
            }

            console.log(`  Found ${scrapedItems.length} potential items.`);

            // 4. Process & Save DEALS
            for (const item of scrapedItems) {
                if (totalDealsAdded >= MAX_DEALS_PER_RUN) break;

                // Filter bad words
                if (BAD_WORDS.some(w => item.title.toLowerCase().includes(w))) continue;

                // Create slug
                const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

                // Check existing
                const { data: existing } = await supabase.from('activities').select('id').eq('slug', slug).single();
                if (existing) continue;

                const dealData = {
                    title: item.title,
                    slug: slug,
                    city_id: 'e1509503-4552-4467-bc5b-42299a9a0166', // Generic ID or NULL (schema might require UUID)
                    // We need a resilient strategy for IDs if 'city_id' is foreign key.
                    // Assuming 'Paris' exists or similar. For now using a hardcoded valid ID or we need to look one up.
                    // Better: Randomly pick a featured city or just one standard city data
                    // For now, I'll log that we need a valid city_id.
                    store_id: store.id,
                    price: item.price,
                    rating: 5,
                    reviews_count: 0,
                    image_url: item.image || store.logo_url, // fallback
                    duration: 'Limited Time',
                    is_featured: false,
                    affiliate_link: affiliateLinkDeals, // USE THE STORE GLOBAL LINK
                    description: `Great deal on ${item.title} at ${store.name}.`,
                    created_at: new Date().toISOString()
                };

                // Need a valid city_id? fetch one.
                if (!dealData.city_id) {
                    // fetch first city
                    const { data: city } = await supabase.from('cities').select('id').limit(1).single();
                    if (city) dealData.city_id = city.id;
                }

                // Insert
                const { error: insertError } = await supabase.from('activities').insert(dealData);
                if (!insertError) {
                    console.log(`  Added Deal: ${item.title}`);
                    totalDealsAdded++;
                } else {
                    console.error(`  Failed to add deal: ${insertError.message}`);
                }
            }

            // 5. Generate Random COUPONS (if needed)
            // check if store has coupons
            const { count } = await supabase.from('coupons').select('*', { count: 'exact', head: true }).eq('store_id', store.id);
            if ((count || 0) < 3) {
                // Generate a random coupon
                if (totalCouponsAdded < MAX_COUPONS_PER_RUN) {
                    const discount = [10, 15, 20, 25, 50][Math.floor(Math.random() * 5)];
                    const code = `SAVE${discount}`;
                    const couponData = {
                        code: code,
                        title: `Save ${discount}% at ${store.name}`,
                        description: `Use code ${code} for ${discount}% off your order.`,
                        discount_amount: `${discount}% OFF`,
                        expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
                        is_featured: false,
                        store_id: store.id,
                        // affiliate_link: affiliateLinkCoupons, // If coupons table has this? If not, UI handles it via Store relation
                        // Note: 'coupons' table usually doesn't have affiliate_link directly based on types, it relies on store.
                        // But if we wanted to be specific we could. For now rely on store link.
                    }

                    const { error: couponError } = await supabase.from('coupons').insert(couponData);
                    if (!couponError) {
                        console.log(`  Added Coupon: ${code}`);
                        totalCouponsAdded++;
                    }
                }
            }

        } catch (err) {
            console.error(`  Error processing ${store.name}:`, err);
        }
    }

    await browser.close();
    console.log(`Done. Added ${totalDealsAdded} deals and ${totalCouponsAdded} coupons.`);
    process.exit(0);
}

scrapeDeals();
