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
    const { data: allStores, error: storeError } = await supabase
        .from('stores')
        .select('id, name, slug, website_url, logo_url, affiliate_link_deals, affiliate_link_coupons');

    if (storeError) {
        console.error('Error fetching stores:', storeError);
        return;
    }

    console.log('Fetched stores raw:', allStores?.map(s => `${s.name} (${s.website_url})`));
    const stores = allStores?.filter(s => s.website_url && s.website_url.length > 5 && !s.website_url.includes('localhost')) || [];

    if (stores.length === 0) {
        console.log('No stores with URLs found.');
        return;
    }

    console.log(`Found ${stores.length} valid stores to check.`);

    // 2. Launch Browser
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    let totalDealsAdded = 0;
    let totalCouponsAdded = 0;

    for (const store of stores) {
        if (totalDealsAdded >= MAX_DEALS_PER_RUN && totalCouponsAdded >= MAX_COUPONS_PER_RUN) break;

        console.log(`\nProcessing ${store.name} (${store.website_url})...`);
        const affiliateLinkDeals = store.affiliate_link_deals || store.website_url;
        const affiliateLinkCoupons = store.affiliate_link_coupons || store.website_url;

        try {
            const page = await browser.newPage();
            // Set User Agent to avoid 403
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            await page.goto(store.website_url, { waitUntil: 'networkidle2', timeout: 45000 });

            const content = await page.content();
            const $ = cheerio.load(content);
            const pageTitle = $('title').text().trim();
            console.log(`  Page Title: ${pageTitle}`);

            // 3. Generic Scraping Strategy
            const scrapedItems: any[] = [];

            // Selector 1: Schema.org Product/Offer/Event
            $('script[type="application/ld+json"]').each((_, el) => {
                try {
                    const json = JSON.parse($(el).html() || '{}');
                    const processEntity = (entity: any) => {
                        // Check for common e-commerce types
                        const type = entity['@type'];
                        if (['Product', 'Offer', 'Event', 'Hotel', 'LodgingBusiness', 'TouristAttraction'].includes(type)) {
                            const price = entity.offers?.price || entity.price || entity.lowPrice || entity.priceRange;
                            const name = entity.name || entity.headline;
                            if (name && (price || entity.offers)) {
                                scrapedItems.push({
                                    title: name,
                                    price: typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : (price || 0),
                                    image: entity.image,
                                    link: store.website_url
                                });
                            }
                        }
                    };

                    if (Array.isArray(json)) json.forEach(processEntity);
                    else if (json['@graph']) json['@graph'].forEach(processEntity);
                    else processEntity(json);

                } catch (e) { }
            });

            // Selector 2: Visual Scrape (more aggressive)
            if (scrapedItems.length === 0) {
                // Look for containers with price-like text
                const priceRegex = /[$€£]\s*[0-9]+(\.[0-9]{2})?/;

                $('div, article, li').each((_, el) => {
                    if (scrapedItems.length > 5) return; // Limit

                    const text = $(el).text();
                    if (text.length > 500) return; // Skip big containers

                    // Must contain price
                    const priceMatch = text.match(priceRegex);
                    if (priceMatch) {
                        // Must contain title-like element
                        const titleEl = $(el).find('h1, h2, h3, h4, h5, strong, .title').first();
                        const title = titleEl.text().trim();

                        // Must have image
                        const img = $(el).find('img').first().attr('src') || $(el).find('img').first().attr('data-src');

                        if (title && title.length > 5 && title.length < 100 && img) {
                            const priceRef = parseFloat(priceMatch[0].replace(/[^0-9.]/g, ''));
                            scrapedItems.push({
                                title: title,
                                price: priceRef,
                                image: img
                            });
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
