-- ==============================================================================
-- HOME & MORE FURNITURE — 2-SLOT ADVERTISEMENT SYSTEM OPTIONAL SCHEMA EXTENSION
-- Adds dedicated JSONB design_config and updated_at columns to public.advertisements.
-- Note: The app already works immediately without running this migration, and will
-- automatically use these columns once applied.
-- ==============================================================================

alter table public.advertisements
  add column if not exists design_config jsonb default '{}'::jsonb,
  add column if not exists updated_at timestamptz default now();

-- Allow desktop_image to be empty for pure Text/Design Mode advertisements
alter table public.advertisements
  alter column desktop_image set default '';
