-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Gallery Module Tables

-- Albums Table
create table if not exists public.albums (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  event_date date,
  cover_image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Gallery Images Table
create table if not exists public.gallery_images (
  id uuid default uuid_generate_v4() primary key,
  album_id uuid references public.albums(id) on delete cascade,
  url text not null,
  caption text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Storage Bucket for Gallery
-- Note: You might need to create the bucket manually in the dashboard if this SQL fails, 
-- but the policies below will work once the bucket exists.
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- 3. RLS Policies for Gallery

-- Albums: Public Read, Admin Write
alter table public.albums enable row level security;

create policy "Public albums are viewable by everyone"
  on public.albums for select
  using (true);

create policy "Admins can insert albums"
  on public.albums for insert
  with check (auth.jwt() ->> 'role' = 'service_role' or exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'Admin'
  ));

create policy "Admins can update albums"
  on public.albums for update
  using (auth.jwt() ->> 'role' = 'service_role' or exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'Admin'
  ));

create policy "Admins can delete albums"
  on public.albums for delete
  using (auth.jwt() ->> 'role' = 'service_role' or exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'Admin'
  ));

-- Gallery Images: Public Read, Admin Write
alter table public.gallery_images enable row level security;

create policy "Public gallery images are viewable by everyone"
  on public.gallery_images for select
  using (true);

create policy "Admins can insert gallery images"
  on public.gallery_images for insert
  with check (auth.jwt() ->> 'role' = 'service_role' or exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'Admin'
  ));

create policy "Admins can delete gallery images"
  on public.gallery_images for delete
  using (auth.jwt() ->> 'role' = 'service_role' or exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'Admin'
  ));

-- Storage Policies for 'gallery' bucket
create policy "Gallery images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'gallery' );

create policy "Admins can upload gallery images"
  on storage.objects for insert
  with check (
    bucket_id = 'gallery' and (
      auth.jwt() ->> 'role' = 'service_role' or exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'Admin'
      )
    )
  );

create policy "Admins can delete gallery images"
  on storage.objects for delete
  using (
    bucket_id = 'gallery' and (
      auth.jwt() ->> 'role' = 'service_role' or exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'Admin'
      )
    )
  );

-- 4. Projects Module

create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  learned text,
  tags text[],
  project_type text check (project_type in ('solo', 'team')),
  github_url text,
  demo_url text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for Projects
alter table public.projects enable row level security;

create policy "Projects are viewable by everyone"
  on public.projects for select
  using (true);

create policy "Users can insert their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- 5. Leaderboard Module

-- View for Leaderboard Stats
-- Assumes 'projects' table exists with 'user_id' and 'likes' (or similar)
-- If 'likes' is a separate table, adjust the join.
-- This is a simplified view based on project count.

create or replace view public.leaderboard as
select 
  p.id as user_id,
  p.full_name,
  p.avatar_url,
  count(proj.id) as project_count,
  -- Placeholder for likes/score logic. Adjust based on actual schema.
  -- For now, score = project_count * 10
  (count(proj.id) * 10) as score
from public.profiles p
left join public.projects proj on p.id = proj.user_id
group by p.id, p.full_name, p.avatar_url
order by score desc;

-- Grant access to the view
grant select on public.leaderboard to anon, authenticated, service_role;
