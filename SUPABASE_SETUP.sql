-- Arusha Grand Safari Hotel Supabase setup
-- Run this in Supabase SQL Editor.
-- IMPORTANT: After running this, create Auth users in Supabase Authentication > Users:
-- owner@arushagrandsafarihotel.com  password: 1234567890
-- worker@arushagrandsafarihotel.com password: 123456789
-- Extra workers added in the owner panel also need matching Supabase Auth users with the SAME email.

create extension if not exists pgcrypto;

drop function if exists public.current_staff_role() cascade;
drop function if exists public.current_staff_permissions() cascade;
drop function if exists public.get_staff_login_email(text) cascade;
drop table if exists public.staff_profiles cascade;

create table if not exists public.rooms (
  id text primary key,
  available boolean default true,
  quantity integer default 0,
  offer jsonb default '{}'::jsonb,
  name jsonb default '{}'::jsonb,
  price text default '',
  image text default '',
  size text default '',
  bed jsonb default '{}'::jsonb,
  text jsonb default '{}'::jsonb,
  tags jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  phone text,
  email text,
  room_id text references public.rooms(id),
  room_name text,
  check_in date,
  check_out date,
  guests integer default 1,
  message text,
  status text default 'pending',
  payment_status text default 'unpaid',
  created_at timestamptz default now()
);

create table public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  username text unique not null,
  role text not null check (role in ('owner','worker')) default 'worker',
  full_name text default '',
  email text unique not null,
  phone text default '',
  photo_url text default '',
  active boolean default true,
  permissions jsonb default '{"view_reservations":true,"receive_orders":true,"create_bookings":true,"edit_room_status":true,"confirm_payments":false}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.hotel_settings (
  id text primary key default 'main',
  data jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.gallery_images (
  id text primary key,
  url text not null,
  title jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create or replace function public.current_staff_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.staff_profiles
  where active = true
    and (
      auth_user_id = auth.uid()
      or lower(email) = lower(coalesce(auth.jwt() ->> 'email',''))
    )
  limit 1;
$$;

create or replace function public.current_staff_permissions()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select permissions
  from public.staff_profiles
  where active = true
    and (
      auth_user_id = auth.uid()
      or lower(email) = lower(coalesce(auth.jwt() ->> 'email',''))
    )
  limit 1;
$$;

create or replace function public.get_staff_login_email(p_username text)
returns table(email text, role text)
language sql
stable
security definer
set search_path = public
as $$
  select staff_profiles.email, staff_profiles.role
  from public.staff_profiles
  where active = true
    and lower(username) = lower(p_username)
  limit 1;
$$;

grant execute on function public.get_staff_login_email(text) to anon, authenticated;
grant execute on function public.current_staff_role() to anon, authenticated;
grant execute on function public.current_staff_permissions() to anon, authenticated;

alter table public.rooms enable row level security;
alter table public.bookings enable row level security;
alter table public.staff_profiles enable row level security;
alter table public.hotel_settings enable row level security;
alter table public.gallery_images enable row level security;

drop policy if exists "Public can read rooms" on public.rooms;
create policy "Public can read rooms" on public.rooms for select using (true);

drop policy if exists "Owner can manage rooms" on public.rooms;
create policy "Owner can manage rooms" on public.rooms
for all using (public.current_staff_role() = 'owner')
with check (public.current_staff_role() = 'owner');

drop policy if exists "Permitted workers can update room status" on public.rooms;
create policy "Permitted workers can update room status" on public.rooms
for update using (
  public.current_staff_role() = 'worker'
  and coalesce((public.current_staff_permissions() ->> 'edit_room_status')::boolean,false) = true
)
with check (
  public.current_staff_role() = 'worker'
  and coalesce((public.current_staff_permissions() ->> 'edit_room_status')::boolean,false) = true
);

drop policy if exists "Public can create bookings" on public.bookings;
create policy "Public can create bookings" on public.bookings for insert with check (true);

drop policy if exists "Staff can read bookings" on public.bookings;
create policy "Staff can read bookings" on public.bookings
for select using (
  public.current_staff_role() = 'owner'
  or (public.current_staff_role() = 'worker' and coalesce((public.current_staff_permissions() ->> 'view_reservations')::boolean,false) = true)
);

drop policy if exists "Staff can update bookings" on public.bookings;
create policy "Staff can update bookings" on public.bookings
for update using (
  public.current_staff_role() = 'owner'
  or (public.current_staff_role() = 'worker' and (
    coalesce((public.current_staff_permissions() ->> 'receive_orders')::boolean,false) = true
    or coalesce((public.current_staff_permissions() ->> 'edit_room_status')::boolean,false) = true
    or coalesce((public.current_staff_permissions() ->> 'confirm_payments')::boolean,false) = true
  ))
)
with check (
  public.current_staff_role() = 'owner'
  or (public.current_staff_role() = 'worker' and (
    coalesce((public.current_staff_permissions() ->> 'receive_orders')::boolean,false) = true
    or coalesce((public.current_staff_permissions() ->> 'edit_room_status')::boolean,false) = true
    or coalesce((public.current_staff_permissions() ->> 'confirm_payments')::boolean,false) = true
  ))
);

drop policy if exists "Owner can manage staff profiles" on public.staff_profiles;
create policy "Owner can manage staff profiles" on public.staff_profiles
for all using (public.current_staff_role() = 'owner')
with check (public.current_staff_role() = 'owner');

drop policy if exists "Staff can read own profile" on public.staff_profiles;
create policy "Staff can read own profile" on public.staff_profiles
for select using (
  lower(email) = lower(coalesce(auth.jwt() ->> 'email',''))
  or auth_user_id = auth.uid()
  or public.current_staff_role() = 'owner'
);

drop policy if exists "Public can read hotel settings" on public.hotel_settings;
create policy "Public can read hotel settings" on public.hotel_settings for select using (true);

drop policy if exists "Owner can manage hotel settings" on public.hotel_settings;
create policy "Owner can manage hotel settings" on public.hotel_settings
for all using (public.current_staff_role() = 'owner')
with check (public.current_staff_role() = 'owner');

drop policy if exists "Public can read gallery images" on public.gallery_images;
create policy "Public can read gallery images" on public.gallery_images for select using (true);

drop policy if exists "Owner can manage gallery images" on public.gallery_images;
create policy "Owner can manage gallery images" on public.gallery_images
for all using (public.current_staff_role() = 'owner')
with check (public.current_staff_role() = 'owner');

insert into public.rooms (id, available, quantity, offer, name, price, image, size, bed, text, tags) values
('deluxe-meru', true, 8, '{"en":"Free breakfast today","sw":"Kifungua kinywa bure leo"}', '{"en":"Deluxe Meru Room","sw":"Chumba cha Deluxe Meru"}', '$145', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&h=850&q=82', '32 sqm', '{"en":"King / Twin","sw":"King / Twin"}', '{"en":"Quiet comfort for business or safari stopovers.","sw":"Faraja tulivu kwa biashara au mapumziko ya safari."}', '{"en":["Breakfast","Fast Wi-Fi","City view"],"sw":["Kifungua kinywa","Wi-Fi ya kasi","Muonekano wa jiji"]}'),
('executive-garden', true, 5, '{"en":"10% off this week","sw":"Punguzo 10% wiki hii"}', '{"en":"Executive Garden Suite","sw":"Suti ya Executive Garden"}', '$230', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&h=850&q=82', '48 sqm', '{"en":"King bed","sw":"Kitanda cha King"}', '{"en":"Elegant living space with garden-facing calm.","sw":"Nafasi ya kifahari yenye utulivu wa bustani."}', '{"en":["Lounge","Work desk","Airport help"],"sw":["Sebule","Meza ya kazi","Msaada wa airport"]}'),
('family-safari', true, 3, '{"en":"Family package available","sw":"Ofa ya familia ipo"}', '{"en":"Family Safari Room","sw":"Chumba cha Familia Safari"}', '$265', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&h=850&q=82', '55 sqm', '{"en":"2 Queen beds","sw":"Vitanda 2 vya Queen"}', '{"en":"Spacious, bright, and designed for family travel.","sw":"Kikubwa, chenye mwanga na kimefaa kwa familia."}', '{"en":["Family setup","Smart TV","Extra storage"],"sw":["Mpangilio wa familia","Smart TV","Nafasi ya ziada"]}'),
('presidential-kili', true, 1, '{"en":"VIP airport pickup","sw":"Usafiri wa VIP uwanja wa ndege"}', '{"en":"Presidential Kilimanjaro Suite","sw":"Suti ya Rais Kilimanjaro"}', '$420', 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&h=850&q=82', '78 sqm', '{"en":"Super King","sw":"Super King"}', '{"en":"Premium suite for honeymoons, VIP stays, and long escapes.","sw":"Suti ya hali ya juu kwa fungate, wageni maalumu na ukaaji mrefu."}', '{"en":["Private balcony","Mini bar","Concierge"],"sw":["Balkoni binafsi","Mini bar","Huduma maalumu"]}')
on conflict (id) do nothing;

insert into public.hotel_settings (id, data) values
('main', '{"hotelName":{"en":"Arusha Grand Safari Hotel","sw":"Hoteli ya Arusha Grand Safari"},"tagline":{"en":"Luxury • Nature • Hospitality","sw":"Kifahari • Asili • Ukarimu"},"address":{"en":"Arusha City, Tanzania","sw":"Jiji la Arusha, Tanzania"},"phone":"+255 746 584 214","whatsapp":"255746584214","email":"reservations@arushagrandsafarihotel.co.tz","footer":{"en":"Luxury hotel in Arusha for safari, business, and leisure.","sw":"Hoteli ya kifahari Arusha kwa safari, biashara na mapumziko."},"mapText":{"en":"Google Map Placeholder\nArusha, Tanzania","sw":"Sehemu ya Ramani ya Google\nArusha, Tanzania"}}'::jsonb)
on conflict (id) do nothing;

insert into public.gallery_images (id, url, title) values
('gallery-1','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&h=850&q=82','{"en":"Pool view","sw":"Muonekano wa bwawa"}'::jsonb),
('gallery-2','https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&h=850&q=82','{"en":"Spa comfort","sw":"Utulivu wa spa"}'::jsonb),
('gallery-3','https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&h=850&q=82','{"en":"Hotel bar","sw":"Baa ya hoteli"}'::jsonb),
('gallery-4','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1500&h=1000&q=82','{"en":"Luxury lobby","sw":"Mapokezi ya kifahari"}'::jsonb)
on conflict (id) do nothing;

insert into public.staff_profiles (username, role, full_name, email, phone, photo_url, active, permissions) values
('owner','owner','Hotel Owner','scbernard004@gmail.com','0746584214','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&h=900&q=82',true,'{"view_reservations":true,"receive_orders":true,"create_bookings":true,"edit_room_status":true,"confirm_payments":true,"manage_content":true,"manage_workers":true}'::jsonb),
('worker','worker','Front Desk Worker','worker@arushagrandsafarihotel.com','0746584214','https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=900&h=900&q=82',true,'{"view_reservations":true,"receive_orders":true,"create_bookings":true,"edit_room_status":true,"confirm_payments":false}'::jsonb)
on conflict (username) do update set
  role=excluded.role,
  full_name=excluded.full_name,
  email=excluded.email,
  phone=excluded.phone,
  photo_url=excluded.photo_url,
  active=excluded.active,
  permissions=excluded.permissions,
  updated_at=now();
