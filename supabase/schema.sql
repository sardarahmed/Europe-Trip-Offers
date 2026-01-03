-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- CATEGORIES TABLE (New)
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  type text not null check (type in ('city', 'activity', 'coupon', 'blog')), -- 'city', 'activity', 'coupon', 'blog'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- HERO CONTENT TABLE (New)
create table hero_content (
  id uuid default uuid_generate_v4() primary key,
  page_slug text unique not null, -- e.g. 'home'
  title text not null,
  subtitle text,
  background_image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- NAVBAR SETTINGS TABLE (New)
create table navbar_settings (
  id uuid default uuid_generate_v4() primary key,
  cta_text text not null default 'Get 20% OFF',
  cta_link text not null default '/offers',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- CITIES TABLE
create table cities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  country text not null,
  description text,
  image_url text,
  featured boolean default false,
  activity_count int default 0,
  category_id uuid references categories(id), -- e.g. "Coastal", "Historic", "Urban"
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ACTIVITIES / OFFERS TABLE
create table activities (
  id uuid default uuid_generate_v4() primary key,
  city_id uuid references cities(id) on delete cascade,
  category_id uuid references categories(id), -- e.g. "Museums", "Tours", "Food"
  title text not null,
  slug text unique not null,
  description text,
  highlights text[], -- Array of strings
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

-- COUPONS TABLE
create table coupons (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references categories(id), -- e.g. "Seasonal", "Black Friday"
  code text not null,
  title text not null,
  description text,
  discount_amount text, -- e.g. "10% OFF" or "€20 OFF"
  expiry_date timestamp with time zone,
  image_url text, -- Small image for coupon card
  activity_id uuid references activities(id), -- Optional: link to specific activity
  terms text,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- BLOG POSTS TABLE
create table posts (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references categories(id), -- e.g. "Guides", "Tips"
  title text not null,
  slug text unique not null,
  excerpt text,
  content text, -- HTML or Markdown
  image_url text,
  author text,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ROW LEVEL SECURITY (RLS) POLICIES
alter table categories enable row level security;
alter table hero_content enable row level security;
alter table navbar_settings enable row level security;
alter table cities enable row level security;
alter table activities enable row level security;
alter table coupons enable row level security;
alter table posts enable row level security;

-- Allow public read access (Select) for everyone
create policy "Public categories are viewable by everyone" on categories for select using (true);
create policy "Public hero content is viewable by everyone" on hero_content for select using (true);
create policy "Public navbar settings are viewable by everyone" on navbar_settings for select using (true);
create policy "Public cities are viewable by everyone" on cities for select using (true);
create policy "Public activities are viewable by everyone" on activities for select using (true);
create policy "Public coupons are viewable by everyone" on coupons for select using (true);
create policy "Public posts are viewable by everyone" on posts for select using (true);
