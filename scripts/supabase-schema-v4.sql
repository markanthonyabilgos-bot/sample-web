-- V4: fix silent save failures. Run this in Supabase SQL Editor. Safe to re-run.
-- 1) tour flag on inbox (contact form sends tour:true/false; without this column every application insert fails)
-- 2) ensure every column/table lib/store.js uses exists (harmless if schemas v1-v3 were fully run)
-- 3) write policies for content tables so open-admin edits work with the anon key
--    (v1 already set public-write precedent on events/announcements; extended to orgs/gallery/polls)

-- events columns used by the app
alter table events add column if not exists place text default '';
alter table events add column if not exists org text default '';
alter table events add column if not exists description text default '';

-- announcements columns used by the app
alter table announcements add column if not exists body text default '';
alter table announcements add column if not exists pinned boolean default false;
alter table announcements add column if not exists category text default 'General';

-- content tables (same shape as v2; skipped if already created)
create table if not exists orgs (
  id text primary key,
  name text not null,
  advisor text default '',
  members int default 0,
  day text default '',
  "desc" text default ''
);
create table if not exists gallery (
  id text primary key,
  title text not null,
  caption text default '',
  image text default '',
  created_at timestamptz default now()
);
create table if not exists rsvps (
  id text primary key,
  name text not null,
  "eventId" text not null,
  at timestamptz default now()
);
create table if not exists inbox (
  id text primary key,
  name text not null,
  grade text default '',
  club text default '',
  message text not null,
  tour boolean default false,
  at timestamptz default now()
);

-- the actual fix for lost applications/tour requests on existing databases
alter table inbox add column if not exists grade text default '';
alter table inbox add column if not exists club text default '';
alter table inbox add column if not exists tour boolean default false;

-- polls / votes / reactions / newsletter (same shape as v3; skipped if already created)
create table if not exists polls (
  id text primary key,
  question text not null,
  options jsonb not null default '[]',
  active boolean default true,
  created_at timestamptz default now()
);
create table if not exists poll_votes (
  id text primary key,
  poll_id text not null references polls(id) on delete cascade,
  option text not null,
  at timestamptz default now()
);
create table if not exists reactions (
  id text primary key,
  target text not null,
  emoji text not null,
  name text default 'anon',
  at timestamptz default now()
);
create table if not exists newsletter (
  id text primary key,
  email text unique not null,
  at timestamptz default now()
);

-- RLS: keep anon reads open; allow anon writes on staff-managed content tables
-- (open-admin site: the /admin UI has no login by your choice, so the API must be able
-- to write with the anon key when no service-role key is set server-side)
alter table events enable row level security;
alter table announcements enable row level security;
alter table orgs enable row level security;
alter table gallery enable row level security;
alter table polls enable row level security;
alter table rsvps enable row level security;
alter table inbox enable row level security;

drop policy if exists "public read" on events;
create policy "public read" on events for select using (true);
drop policy if exists "public write" on events;
create policy "public write" on events for all using (true) with check (true);

drop policy if exists "public read" on announcements;
create policy "public read" on announcements for select using (true);
drop policy if exists "public write" on announcements;
create policy "public write" on announcements for all using (true) with check (true);

drop policy if exists "public read orgs" on orgs;
create policy "public read orgs" on orgs for select using (true);
drop policy if exists "public write orgs" on orgs;
create policy "public write orgs" on orgs for all using (true) with check (true);

drop policy if exists "public read gallery" on gallery;
create policy "public read gallery" on gallery for select using (true);
drop policy if exists "public write gallery" on gallery;
create policy "public write gallery" on gallery for all using (true) with check (true);

drop policy if exists "public read polls" on polls;
create policy "public read polls" on polls for select using (true);
drop policy if exists "public write polls" on polls;
create policy "public write polls" on polls for all using (true) with check (true);

-- public can submit RSVPs + applications (insert only, no edit/delete)
drop policy if exists "public insert rsvps" on rsvps;
create policy "public insert rsvps" on rsvps for insert with check (true);
drop policy if exists "public insert inbox" on inbox;
create policy "public insert inbox" on inbox for insert with check (true);

-- admin reads inbox/rsvps through the anon key (needed when no service-role key is set)
drop policy if exists "public read rsvps" on rsvps;
create policy "public read rsvps" on rsvps for select using (true);
drop policy if exists "public read inbox" on inbox;
create policy "public read inbox" on inbox for select using (true);
