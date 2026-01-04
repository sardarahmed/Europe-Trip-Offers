-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. STORES TABLE (Base entity for brands)
CREATE TABLE IF NOT EXISTS stores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    rating NUMERIC DEFAULT 0,
    review_count INTEGER DEFAULT 0
);

-- 2. CATEGORIES TABLE
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  type text not null check (type in ('city', 'activity', 'coupon', 'blog')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. HERO CONTENT
create table hero_content (
  id uuid default uuid_generate_v4() primary key,
  page_slug text unique not null,
  title text not null,
  subtitle text,
  background_image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. NAVBAR SETTINGS
create table navbar_settings (
  id uuid default uuid_generate_v4() primary key,
  cta_text text not null default 'Get 20% OFF',
  cta_link text not null default '/offers',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. CITIES TABLE
create table cities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  country text not null,
  description text,
  image_url text,
  featured boolean default false,
  activity_count int default 0,
  category_id uuid references categories(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. ACTIVITIES / OFFERS TABLE
create table activities (
  id uuid default uuid_generate_v4() primary key,
  city_id uuid references cities(id) on delete cascade,
  category_id uuid references categories(id),
  store_id UUID REFERENCES stores(id), -- Linked Store
  title text not null,
  slug text unique not null,
  description text,
  highlights text[],
  duration text,
  price decimal(10,2),
  discount_price decimal(10,2),
  rating decimal(2,1) default 5.0,
  reviews_count int default 0,
  image_url text,
  affiliate_link text,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 7. COUPONS TABLE
create table coupons (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references categories(id),
  store_id UUID REFERENCES stores(id), -- Linked Store
  code text not null,
  title text not null,
  description text,
  discount_amount text,
  expiry_date timestamp with time zone,
  image_url text,
  activity_id uuid references activities(id),
  terms text,
  -- Usage Stats (Added in Migration 04)
  used_count INTEGER DEFAULT 0,
  success_rate INTEGER DEFAULT 100,
  last_verified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 8. BLOG POSTS TABLE
create table posts (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references categories(id),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  image_url text,
  author text,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 9. SECURITY (RLS)
alter table categories enable row level security;
alter table hero_content enable row level security;
alter table navbar_settings enable row level security;
alter table cities enable row level security;
alter table activities enable row level security;
alter table coupons enable row level security;
alter table posts enable row level security;
alter table stores enable row level security;

-- Public Access Policies
create policy "Public access" on categories for select using (true);
create policy "Public access" on hero_content for select using (true);
create policy "Public access" on navbar_settings for select using (true);
create policy "Public access" on cities for select using (true);
create policy "Public access" on activities for select using (true);
create policy "Public access" on coupons for select using (true);
create policy "Public access" on posts for select using (true);
create policy "Public access" on stores for select using (true);

-- Authenticated Write Access (Simplified)
create policy "Auth write stores" on stores for insert with check (auth.role() = 'authenticated');
create policy "Auth update stores" on stores for update using (auth.role() = 'authenticated');
-- (Add similar policies for other tables if needed, usually managed via dashboard or specific admin migrations)
