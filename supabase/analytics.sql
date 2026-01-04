-- Visits Table: Tracks the user session
create table if not exists visits (
  id uuid default uuid_generate_v4() primary key,
  visitor_id uuid not null, -- Persistent ID from cookie/localstorage
  ip text,
  country text,
  city text,
  device text, -- 'Desktop', 'Mobile', 'Tablet'
  browser text,
  os text,
  source text, -- 'Direct', 'Google', 'Facebook'
  medium text, -- 'organic', 'cpc' (paid)
  is_paid boolean default false,
  user_agent text,
  started_at timestamp with time zone default timezone('utc'::text, now()),
  last_active_at timestamp with time zone default timezone('utc'::text, now())
);

-- Page Views Table: Tracks individual page hits within a visit
create table if not exists page_views (
  id uuid default uuid_generate_v4() primary key,
  visit_id uuid references visits(id) on delete cascade,
  path text not null,
  title text,
  duration_seconds int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Policies
alter table visits enable row level security;
alter table page_views enable row level security;

-- Allow Anon (Public) to INSERT tracking data
create policy "Enable insert for anon users" on visits for insert with check (true);
create policy "Enable update for anon users" on visits for update using (true);
create policy "Enable insert for anon users" on page_views for insert with check (true);
create policy "Enable update for anon users" on page_views for update using (true);

-- Allow Anon to SELECT basic data (needed for real-time upserts if logic requires it, 
-- or strictly restricted to Admin. For now, we allow select to ensure the Tracker 
-- can check if a visit exists, although usually we just INSERT).
-- Let's allow public Read so the logic is simpler for MVP, 
-- but in production you'd use a Service Role for the API.
create policy "Enable read for anon users" on visits for select using (true);
create policy "Enable read for anon users" on page_views for select using (true);
