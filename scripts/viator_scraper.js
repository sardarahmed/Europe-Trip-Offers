require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

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

function getProxies() {
    // Hardcoded proxies from user-provided file for reliability in CI/CD
    const rawProxies = [
        "142.111.48.253:7030:vcblyzla:4lphk4ch52by",
        "23.95.150.145:6114:vcblyzla:4lphk4ch52by",
        "198.23.239.134:6540:vcblyzla:4lphk4ch52by",
        "107.172.163.27:6543:vcblyzla:4lphk4ch52by",
        "198.105.121.200:6462:vcblyzla:4lphk4ch52by",
        "64.137.96.74:6641:vcblyzla:4lphk4ch52by",
        "84.247.60.125:6095:vcblyzla:4lphk4ch52by",
        "216.10.27.159:6837:vcblyzla:4lphk4ch52by",
        "23.26.71.145:5628:vcblyzla:4lphk4ch52by",
        "23.27.208.120:5830:vcblyzla:4lphk4ch52by"
    ];

    return rawProxies.map(line => {
        const parts = line.split(':');
        if (parts.length >= 4) {
            return {
                server: `${parts[0]}:${parts[1]}`,
                username: parts[2],
                password: parts[3]
            };
        }
        return null;
    }).filter(p => p !== null);
}

async function ensureStore() {
    const { data: existing } = await supabase.from('stores').select('id').ilike('name', 'Viator').maybeSingle();
    if (existing) return existing.id;

    const { data: newStore, error } = await supabase.from('stores').insert({
        name: 'Viator',
        slug: 'viator',
        website_url: 'https://www.viator.com',
        description: 'Find top-rated tours, activities and attractions.',
        is_featured: true,
        logo_url: 'https://media.licdn.com/dms/image/v2/C4E0BAQG5wS3tU0-v8g/company-logo_200_200/company-logo_200_200/0/1630643767223?e=2147483647&v=beta&t=ViatorLogo'
    }).select().single();

    if (error) {
        console.error('Error creating Viator store:', JSON.stringify(error, null, 2));
        return null;
    }
    return newStore.id;
}

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
                console.error(`Error creating city ${city.name}:`, JSON.stringify(error, null, 2));
                continue;
            }
            cityId = newCity.id;
        }
        city.id = cityId;
    }
}

async function scrapeCity(city, defaultCategoryId, storeId, proxy) {
    console.log(`Scraping ${city.name} using ${proxy ? proxy.server : 'Direct Connection'}...`);

    const launchArgs = ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'];
    if (proxy) {
        launchArgs.push(`--proxy-server=${proxy.server}`);
    }

    const browser = await puppeteer.launch({
        headless: "new",
        args: launchArgs
    });

    const page = await browser.newPage();
    if (proxy) {
        await page.authenticate({ username: proxy.username, password: proxy.password });
    }

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Upgrade-Insecure-Requests': '1'
        });
        await page.setViewport({ width: 1920, height: 1080 });

        // Warm up
        try {
            await page.goto('https://www.viator.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
        } catch (e) { console.log('Warmup failed, continuing...'); }

        await new Promise(r => setTimeout(r, 2000));

        console.log(`Navigating to ${city.url}...`);
        await page.goto(city.url, { waitUntil: 'domcontentloaded', timeout: 60000, referer: 'https://www.viator.com/' });

        const title = await page.title();
        console.log(`Page Title: ${title}`);

        if (title.includes('Access Denied') || title.includes('Just a moment')) {
            console.error(`Blocked even with proxy.`);
            return;
        }

        await new Promise(r => setTimeout(r, 5000));

        // Use DOM scraping as primary
        const domProducts = await page.evaluate(() => {
            const items = [];
            const cards = Array.from(document.querySelectorAll('[data-role="product-card"], [class*="product-card"], [class*="ProductCard"]'));
            const genericCards = cards.length > 0 ? cards : Array.from(document.querySelectorAll('div > a')).map(a => a.parentElement).filter(div => div.innerText.includes('€') || div.innerText.includes('$'));

            genericCards.forEach(card => {
                try {
                    const linkEl = card.querySelector('a') || (card.tagName === 'A' ? card : null);
                    if (!linkEl) return;

                    const text = card.innerText;
                    const priceMatch = text.match(/([€$£]\s?[0-9,.]+)/);
                    const priceRaw = priceMatch ? priceMatch[0] : '0';
                    const price = parseFloat(priceRaw.replace(/[^0-9.]/g, '')) || 0;

                    const img = card.querySelector('img');
                    const image = img ? (img.src || img.getAttribute('data-src')) : '';

                    let title = '';
                    const h = card.querySelector('h1, h2, h3, h4, h5');
                    if (h) title = h.innerText;
                    else title = text.split('\n')[0];

                    if (title.length > 5 && price > 0 && image) {
                        items.push({
                            title: title.trim(),
                            url: linkEl.href,
                            price: price,
                            image: image,
                            rating: 4.5,
                            duration: 'Variable'
                        });
                    }
                } catch (e) { }
            });
            const unique = [];
            const seen = new Set();
            for (const i of items) {
                if (!seen.has(i.url)) {
                    seen.add(i.url);
                    unique.push(i);
                }
            }
            return unique.slice(0, 10);
        });

        console.log(`Found ${domProducts.length} products.`);

        for (const prod of domProducts) {
            const slug = prod.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);
            const cleanUrl = prod.url.split('?')[0];
            const affiliateLink = `${cleanUrl}?${AFFILIATE_PARAMS}`;

            // Insert Activity
            const activityPayload = {
                title: prod.title,
                slug: slug,
                description: `Experience ${city.name} with: ${prod.title}`,
                city_id: city.id,
                price: prod.price,
                discount_price: prod.price * 0.9,
                image_url: prod.image,
                affiliate_link: affiliateLink,
                category_id: defaultCategoryId,
                store_id: storeId,
                duration: prod.duration,
                is_featured: true,
                rating: prod.rating,
                reviews_count: Math.floor(Math.random() * 500)
            };
            const { data: existingAct } = await supabase.from('activities').select('id').eq('slug', slug).maybeSingle();
            if (existingAct) {
                await supabase.from('activities').update(activityPayload).eq('id', existingAct.id);
            } else {
                await supabase.from('activities').insert(activityPayload);
            }

            // Insert Coupon
            const couponCode = `VIATOR-${slug.slice(0, 10).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
            const couponPayload = {
                code: couponCode,
                title: `Deal: ${prod.title}`,
                discount_amount: `Save 10%`,
                description: `Special deal for ${prod.title}`,
                store_id: storeId,
                category_id: null,
                image_url: prod.image,
                is_featured: true,
                terms: 'Valid for online bookings.',
                used_count: 0,
                success_rate: 100,
                expiry_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
            };
            const { data: existingCoupon } = await supabase.from('coupons').select('id').eq('title', couponPayload.title).maybeSingle();
            if (existingCoupon) {
                await supabase.from('coupons').update(couponPayload).eq('id', existingCoupon.id);
            } else {
                await supabase.from('coupons').insert(couponPayload);
            }
        }

    } catch (e) {
        console.error(`Error scraping ${city.name}:`, e.message);
    } finally {
        await browser.close();
    }
}

async function run() {
    let defaultCategoryId;
    const { data: cat } = await supabase.from('categories').select('id').eq('type', 'activity').limit(1).maybeSingle();
    if (cat) defaultCategoryId = cat.id;

    const storeId = await ensureStore();
    await ensureFamousCities();

    // Load proxies
    const proxies = getProxies();
    console.log(`Loaded ${proxies.length} proxies.`);

    for (let i = 0; i < FAMOUS_CITIES.length; i++) {
        const city = FAMOUS_CITIES[i];
        // Rotate proxy: each city gets a different proxy
        const proxy = proxies.length > 0 ? proxies[i % proxies.length] : null;
        await scrapeCity(city, defaultCategoryId, storeId, proxy);
    }

    console.log('Done.');
}

run();
