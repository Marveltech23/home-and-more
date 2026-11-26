-- ==============================================================================
-- HOME & MORE FURNITURE — PRODUCTION SECURITY & RLS HARDENING MIGRATION
-- Run this in Supabase Dashboard -> SQL Editor AFTER creating your Admin user
-- in Authentication -> Users and disabling public user signups.
-- ==============================================================================

-- 1. Drop legacy wide-open development policies that allowed anonymous writes/deletes
drop policy if exists "Admins can do all on categories" on public.categories;
drop policy if exists "Admins can do all on products" on public.products;
drop policy if exists "Admins can do all on ads" on public.advertisements;
drop policy if exists "Admins can do all on blogs" on public.blogs;
drop policy if exists "Admins can do all on testimonials" on public.testimonials;
drop policy if exists "Admins can do all on enquiries" on public.enquiries;
drop policy if exists "Admins can do all on site_settings" on public.site_settings;
drop policy if exists "Admins can do all on media" on public.media;
drop policy if exists "Anyone can create enquiry" on public.enquiries;

-- 2. Ensure Row Level Security is enabled and enforced on every table
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.advertisements enable row level security;
alter table public.blogs enable row level security;
alter table public.enquiries enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;
alter table public.media enable row level security;

-- 3. Customer enquiries: public may ONLY submit valid enquiries (never read, edit, or delete)
create policy "Public can submit valid enquiry"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (
    char_length(trim(coalesce(customer_name, ''))) between 2 and 120
    and char_length(trim(coalesce(message, ''))) between 3 and 3000
  );

-- 4. Authenticated Admin-only write & management policies (requires verified Supabase Auth JWT)
create policy "Authenticated admin full access on categories"
  on public.categories for all to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated admin full access on products"
  on public.products for all to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated admin full access on advertisements"
  on public.advertisements for all to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated admin full access on blogs"
  on public.blogs for all to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated admin full access on testimonials"
  on public.testimonials for all to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated admin full access on site_settings"
  on public.site_settings for all to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated admin full access on media"
  on public.media for all to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated admin read/manage enquiries"
  on public.enquiries for select to authenticated
  using (auth.role() = 'authenticated');

create policy "Authenticated admin update enquiries"
  on public.enquiries for update to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated admin delete enquiries"
  on public.enquiries for delete to authenticated
  using (auth.role() = 'authenticated');
