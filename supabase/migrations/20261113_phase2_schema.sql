-- ==============================================================================
-- HOME & MORE FURNITURE — PHASE 2 SUPABASE SCHEMA & INITIAL SEED
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. CATEGORIES TABLE
create table if not exists public.categories (
  id text primary key default ('c_' || floor(extract(epoch from now()))::text),
  slug text unique not null,
  name text not null,
  description text default '',
  image text not null,
  display_order int default 1,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 3. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key default ('p_' || floor(extract(epoch from now()))::text),
  slug text unique not null,
  name text not null,
  tagline text default '',
  description text default '',
  price numeric not null,
  discount_price numeric,
  sku text unique not null,
  stock int default 0,
  category_slug text references public.categories(slug) on update cascade on delete set null,
  image text not null,
  gallery jsonb default '[]'::jsonb,
  dimensions text default '',
  material text default '',
  colors jsonb default '[]'::jsonb,
  featured boolean default false,
  status text default 'published',
  created_at timestamptz default now()
);

-- 4. ADVERTISEMENTS TABLE
create table if not exists public.advertisements (
  id text primary key default ('a_' || floor(extract(epoch from now()))::text),
  title text not null,
  subtitle text default '',
  tagline text default '',
  description text default '',
  button_text text default 'Shop Now',
  button_url text default '/shop',
  placement text default 'hero_bottom',
  desktop_image text not null,
  mobile_image text,
  start_date date default current_date,
  end_date date,
  is_active boolean default true,
  clicks int default 0,
  created_at timestamptz default now()
);

-- 5. BLOGS TABLE
create table if not exists public.blogs (
  id text primary key default ('b_' || floor(extract(epoch from now()))::text),
  slug text unique not null,
  title text not null,
  author text default 'Home & More Styling Team',
  category text default 'Interior Design',
  excerpt text not null,
  content text not null,
  featured_image text not null,
  published_at date default current_date,
  status text default 'published',
  read_time text default '4 min read',
  created_at timestamptz default now()
);

-- 6. ORDERS & ENQUIRIES TABLE
create table if not exists public.enquiries (
  id text primary key default ('e_' || floor(extract(epoch from now()))::text),
  customer_name text not null,
  phone text not null,
  email text,
  product_name text not null,
  product_id text,
  price numeric default 0,
  message text,
  notes text default '',
  status text default 'pending', -- pending, contacted, completed, cancelled
  created_at timestamptz default now()
);

-- 7. TESTIMONIALS TABLE
create table if not exists public.testimonials (
  id text primary key default ('t_' || floor(extract(epoch from now()))::text),
  name text not null,
  location text default 'Abuja',
  quote text not null,
  rating int default 5,
  photo text not null,
  is_published boolean default true,
  created_at timestamptz default now()
);

-- 8. WEBSITE SETTINGS TABLE
create table if not exists public.site_settings (
  id text primary key default 'default_settings',
  business_name text default 'Home & More Furniture',
  slogan text default 'Modern Living. Better You.',
  phone text default '+234 801 234 5678',
  whatsapp_number text default '+2348012345678',
  whatsapp_greeting text default 'Hello Home & More Furniture, I would like to enquire about',
  email text default 'hello@homeandmorefurniture.ng',
  address text default 'Plot 1042 Ahmadu Bello Way, Central Business District, Abuja, Nigeria',
  social jsonb default '{"facebook": "https://facebook.com", "instagram": "https://instagram.com", "youtube": "https://youtube.com"}'::jsonb,
  updated_at timestamptz default now()
);

-- 9. MEDIA ASSETS TABLE
create table if not exists public.media (
  id text primary key default ('m_' || floor(extract(epoch from now()))::text),
  name text not null,
  url text not null,
  type text default 'image/jpeg',
  size text default '1.2 MB',
  dimensions text default '1920x1080',
  category text default 'Products',
  created_at timestamptz default now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.advertisements enable row level security;
alter table public.blogs enable row level security;
alter table public.enquiries enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;
alter table public.media enable row level security;

-- Public can READ active/published storefront data
create policy "Public can view active categories" on public.categories for select using (true);
create policy "Public can view published products" on public.products for select using (true);
create policy "Public can view active ads" on public.advertisements for select using (true);
create policy "Public can view published blogs" on public.blogs for select using (true);
create policy "Public can view published testimonials" on public.testimonials for select using (true);
create policy "Public can view site settings" on public.site_settings for select using (true);
create policy "Public can view media" on public.media for select using (true);

-- Anyone can submit customer enquiries
create policy "Anyone can create enquiry" on public.enquiries for insert with check (true);

-- Authenticated Admin or Full Public Access during setup (can be restricted to auth.role() = 'authenticated')
create policy "Admins can do all on categories" on public.categories for all using (true);
create policy "Admins can do all on products" on public.products for all using (true);
create policy "Admins can do all on ads" on public.advertisements for all using (true);
create policy "Admins can do all on blogs" on public.blogs for all using (true);
create policy "Admins can do all on testimonials" on public.testimonials for all using (true);
create policy "Admins can do all on enquiries" on public.enquiries for all using (true);
create policy "Admins can do all on site_settings" on public.site_settings for all using (true);
create policy "Admins can do all on media" on public.media for all using (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Site Settings
insert into public.site_settings (id, business_name, slogan, phone, whatsapp_number, whatsapp_greeting, email, address)
values (
  'default_settings',
  'Home & More Furniture',
  'Modern Living. Better You.',
  '+234 801 234 5678',
  '+2348012345678',
  'Hello Home & More Furniture, I would like to enquire about',
  'hello@homeandmorefurniture.ng',
  'Plot 1042 Ahmadu Bello Way, Central Business District, Abuja, Nigeria'
) on conflict (id) do nothing;

-- Categories
insert into public.categories (id, slug, name, description, image, display_order, is_active) values
('c1', 'sofas-seating', 'Sofas & Seating', 'Plush modern sectionals, modular sofas, and loveseats engineered for comfort.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80', 1, true),
('c2', 'beds-mattresses', 'Beds & Mattresses', 'Luxurious king and queen beds, orthopedic mattresses, and restful headboards.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80', 2, true),
('c3', 'dining-sets', 'Dining Sets', 'Solid wood and modern dining table sets crafted for memorable family gatherings.', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80', 3, true),
('c4', 'chairs', 'Chairs', 'Statement armchairs, accent chairs, dining chairs, and velvet lounge seats.', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80', 4, true),
('c5', 'wardrobes', 'Wardrobes', 'Spacious bespoke wardrobes, armoires, and bedroom storage organizers.', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80', 5, true),
('c6', 'tv-stands', 'TV Stands', 'Sleek media consoles, acoustic TV credenzas, and cable-managed wall units.', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80', 6, true),
('c7', 'outdoor-furniture', 'Outdoor Furniture', 'All-weather patio sets, hanging swing chairs, and poolside sun loungers.', 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=600&q=80', 7, true)
on conflict (slug) do nothing;

-- Products
insert into public.products (id, slug, name, tagline, description, price, discount_price, sku, stock, category_slug, image, dimensions, material, featured, status) values
('p1', 'accent-armchair', 'Accent Armchair', 'Warm terracotta velvet statement armchair', 'A tufted accent armchair in warm burnt orange velvet, featuring solid oak tapered legs and high-density foam cushioning for luxurious comfort.', 120000, 135000, 'HM-ARM-001', 8, 'chairs', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', '82cm W x 85cm D x 90cm H', 'Burnt Orange Velvet, Kiln-dried Hardwood', true, 'published'),
('p2', 'modern-sofa-set', 'Modern Sofa Set', 'Contemporary 3-seater comfort in slate grey', 'A modern three-seater sofa tailored in textured slate fabric with deep seat cushions, pocket springs, and solid walnut feet. Built to anchor modern living rooms.', 350000, 390000, 'HM-SOF-001', 4, 'sofas-seating', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', '220cm W x 95cm D x 85cm H', 'Stain-resistant textured weave, Walnut timber', true, 'published'),
('p3', 'dining-table-set', 'Dining Table Set', 'Solid wood table with 6 ergonomic upholstered chairs', 'Solid teak dining table with six ergonomically curved chairs upholstered in easy-wipe linen. Beautiful warm honey grain that celebrates authentic woodworking.', 280000, 310000, 'HM-DIN-001', 5, 'dining-sets', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80', '180cm L x 90cm W x 76cm H', 'Solid Teak Wood, Linen Fabric', true, 'published'),
('p4', 'luxury-lounge-chair', 'Luxury Lounge Chair', 'Curved cocoon lounge chair in soft beige boucle', 'A plush cocoon lounge chair in warm beige textured fabric. Sculptural curved backrest, generous deep seat, and understated Scandinavian wooden legs.', 95000, 110000, 'HM-CHR-002', 10, 'chairs', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80', '78cm W x 82cm D x 80cm H', 'Cream Boucle, Oak timber', true, 'published'),
('p5', 'king-plush-upholstered-bed', 'King Plush Upholstered Bed', 'Statement channeled headboard with under-bed storage', 'Transform your bedroom into a 5-star haven. Features a tall vertical-channeled padded headboard in warm beige velvet and heavy-duty steel slat support.', 420000, 470000, 'HM-BED-001', 6, 'beds-mattresses', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', '200cm W x 215cm L x 135cm H', 'Warm Beige Velvet, Reinforced Steel', true, 'published')
on conflict (slug) do nothing;

-- Advertisements
insert into public.advertisements (id, title, subtitle, tagline, description, button_text, button_url, placement, desktop_image, mobile_image, start_date, end_date, is_active) values
('a1', 'Christmas', 'Special Offers', 'Upgrade Your Home This Festive Season', 'Get Amazing Discounts on Premium Furniture', 'Shop Christmas Offers', '/shop', 'hero_bottom', 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=800&q=80', '2026-11-01', '2026-12-31', true)
on conflict (id) do nothing;

-- Testimonials
insert into public.testimonials (id, name, location, quote, rating, photo, is_published) values
('t1', 'Mrs. Adekunle', 'Abuja', 'Excellent quality and stylish designs! My living room looks amazing.', 5, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', true),
('t2', 'Mr. Daniel', 'Abuja', 'Great service and prompt delivery. Highly recommended!', 5, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', true)
on conflict (id) do nothing;
