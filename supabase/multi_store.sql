-- 1. Create Providers Table
create table if not exists providers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  logo_url text,
  affiliate_base_url text, -- Template base if needed
  is_active boolean default true,
  priority int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Add RLS for Providers
alter table providers enable row level security;
create policy "Allow public read" on providers for select using (true);
create policy "Allow admin write" on providers for all using (true); -- Admin secured by Middleware

-- 3. Update Activities Table
alter table activities add column if not exists provider_id uuid references providers(id);
alter table activities add column if not exists currency text default 'USD';

-- 4. Seed Default Provider (Viator)
do $$
declare
  viator_id uuid;
begin
  -- Check if Viator exists, if not insert
  if not exists (select 1 from providers where slug = 'viator') then
    insert into providers (name, slug, logo_url, priority)
    values ('Viator', 'viator', 'https://media.licdn.com/dms/image/v2/C560BAQFhC8n7sJ4c4A/company-logo_200_200/company-logo_200_200/0/1630652480336?e=2147483647&v=beta&t=ViatorLogo', 10)
    returning id into viator_id;
  else
    select id into viator_id from providers where slug = 'viator';
  end if;

  -- 5. Migrate Existing Activities to Viator
  update activities set provider_id = viator_id where provider_id is null;

end $$;
