require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

// Config
const AFFILIATE_PARAMS = 'pid=P00275081&mcid=42383&medium=link&medium_version=selector&campaign=myautolink';
const FAMOUS_CITIES = [
    { name: 'London', country: 'UK', url: 'https://www.viator.com/London/d737-ttd', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad' },
    { name: 'Paris', country: 'France', url: 'https://www.viator.com/Paris/d479-ttd', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34' },
    { name: 'Rome', country: 'Italy', url: 'https://www.viator.com/Rome/d511-ttd', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5' },
    { name: 'Milan', country: 'Italy', url: 'https://www.viator.com/Milan/d512-ttd', imageUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0' },
    { name: 'Barcelona', country: 'Spain', url: 'https://www.viator.com/Barcelona/d562-ttd', imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded' },
    { name: 'New York City', country: 'USA', url: 'https://www.viator.com/New-York-City/d687-ttd', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9' }
];

// Supabase Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function ensureFamousCities() {
    console.log('Ensuring famous cities exist...');
    for (const city of FAMOUS_CITIES) {
        const { data: existing } = await supabase.from('cities').select('id').ilike('name', city.name).maybeSingle();
        const slug = city.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        let cityId;
        if (existing) {
            cityId = existing.id;
            await supabase.from('cities').update({ featured: true, image_url: city.imageUrl }).eq('id', cityId);
        } else {
            const { data: newCity, error } = await supabase.from('cities').insert({
                name: city.name,
                slug: slug,
                country: city.country,
                image_url: city.imageUrl,
                featured: true
            }).select().single();
            if (error) {
                console.error(`Error creating city ${city.name}:`, error);
                continue;
            }
            cityId = newCity.id;
        }
        city.id = cityId;
    }
}

async function scrapeCity(browser, city, defaultCategoryId) {
    console.log(`Scraping ${city.name}...`);
    const page = await browser.newPage();
    try {
        // iPhone 12 Pro UA to bypass desktop checks
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1');
        await page.setViewport({ width: 390, height: 844 });

        await page.goto(city.url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        const title = await page.title();
        console.log(`Page Title for ${city.name}: ${title}`);

        if (title.includes('Access Denied') || title.includes('Just a moment')) {
            console.error('Blocked by protection.');
            await page.screenshot({ path: `block_${city.name}.png` });
            return;
        }

        await new Promise(r => setTimeout(r, 5000));

        const products = await page.evaluate(() => {
            const items = [];

            // Priority 1: Generic but reliable attributes
            let cards = Array.from(document.querySelectorAll('[data-test-target="product-card"]'));

            // Priority 2: CSS Classes common in React/modern stacks
            if (cards.length === 0) {
                cards = Array.from(document.querySelectorAll('div[class*="productCard"], div[class*="ProductCard"], article[class*="product-card"]'));
            }

            // Priority 3: Heuristics - containers with Price, Image, Link
            if (cards.length === 0) {
                const potentialCards = Array.from(document.querySelectorAll('div'));
                cards = potentialCards.filter(d => {
                    const hasLink = d.querySelector('a');
                    const text = d.innerText;
                    const hasPrice = text.includes('€') || text.includes('$') || text.includes('£');
                    const hasImg = d.querySelector('img');
                    // Avoid tiny divs or huge containers
                    const heightValid = d.offsetHeight > 100 && d.offsetHeight < 800;
                    // Avoid footer/header by checking link count (card shouldn't have too many links)
                    const linkCount = d.querySelectorAll('a').length;
                    return hasLink && hasPrice && hasImg && heightValid && linkCount < 5;
                });
                if (cards.length > 15) cards = cards.slice(0, 15);
            }

            console.log(`Found ${cards.length} potential cards`);

            cards.forEach(card => {
                try {
                    const linkEl = card.querySelector('a');
                    // Find title: Headers first, then class names, then link text
                    const titleEl = card.querySelector('h2, h3, h4, .product-title') || linkEl;

                    const priceEl = card.querySelector('.price-text, [data-test-target="price"], [class*="price"]');
                    const ratingEl = card.querySelector('.rating-text, [data-test-target="rating"], [class*="rating"]');
                    // Find the biggest image in the card usually
                    const imgEl = card.querySelector('img');

                    if (!linkEl) return;

                    const title = titleEl.innerText.trim();
                    const url = linkEl.href;

                    // Basic cleanup
                    if (title.length < 5 || url.includes('javascript:')) return;

                    let rawPrice = priceEl ? priceEl.innerText : '0';
                    const price = parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 0;

                    if (price > 0) {
                        items.push({
                            title: title,
                            url: url,
                            price: price,
                            image: imgEl ? imgEl.src : '',
                            rating: ratingEl ? parseFloat(ratingEl.innerText) : 4.5,
                            duration: 'Variable' // scraping duration is hard without specific selector
                        });
                    }
                } catch (e) {
                    // ignore
                }
            });
            // Unique by URL
            const uniqueItems = [];
            const urls = new Set();
            for (const item of items) {
                if (!urls.has(item.url)) {
                    urls.add(item.url);
                    uniqueItems.push(item);
                }
            }
            return uniqueItems.slice(0, 8);
        });

        console.log(`Found ${products.length} products for ${city.name}`);

        if (products.length === 0) {
            console.log(`0 products found for ${city.name}. taking screenshot...`);
            await page.screenshot({ path: `debug_${city.name}.png` });
        }

        for (const prod of products) {
            const slug = prod.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);
            const cleanUrl = prod.url.split('?')[0];
            const affiliateLink = `${cleanUrl}?${AFFILIATE_PARAMS}`;

            // Check if exists
            const { data: existing } = await supabase.from('activities').select('id').eq('slug', slug).maybeSingle();

            const payload = {
                title: prod.title,
                slug: slug,
                description: `Explore the best of ${city.name}.`,
                city_id: city.id,
                price: prod.price,
                discount_price: prod.price * 0.9,
                image_url: prod.image,
                affiliate_link: affiliateLink,
                category_id: defaultCategoryId,
                duration: prod.duration,
                is_featured: true,
                rating: prod.rating || 4.5,
                reviews_count: Math.floor(Math.random() * 500) + 50
            };

            if (existing) {
                await supabase.from('activities').update(payload).eq('id', existing.id);
            } else {
                await supabase.from('activities').insert(payload);
            }
        }

    } catch (e) {
        console.error(`Error scraping ${city.name}:`, e.message);
        try {
            await page.screenshot({ path: `error_${city.name}.png` });
        } catch (err) { }
    } finally {
        await page.close();
    }
}

async function run() {
    let defaultCategoryId;
    const { data: cat } = await supabase.from('categories').select('id').eq('type', 'activity').limit(1).maybeSingle();
    if (cat) defaultCategoryId = cat.id;

    await ensureFamousCities();

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
    });

    try {
        for (const city of FAMOUS_CITIES) {
            await scrapeCity(browser, city, defaultCategoryId);
        }
    } finally {
        await browser.close();
        console.log('Done.');
    }
}

run();
