-- Admin v2 schema: extends events/announcements with orgs, gallery, rsvps, inbox.
-- Run this in Supabase SQL Editor (safe to re-run).

-- add new columns to existing tables
alter table events add column if not exists description text default '';
alter table announcements add column if not exists pinned boolean default false;
alter table announcements add column if not exists category text default 'General';

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
  at timestamptz default now()
);

-- RLS: public read for all; writes via service-role key (server) bypass RLS.
-- Keep anon read open so the public site works without login.
alter table events enable row level security;
alter table announcements enable row level security;
alter table orgs enable row level security;
alter table gallery enable row level security;
alter table rsvps enable row level security;
alter table inbox enable row level security;

drop policy if exists "public read" on events;
create policy "public read" on events for select using (true);
drop policy if exists "public read" on announcements;
create policy "public read" on announcements for select using (true);
drop policy if exists "public read orgs" on orgs;
create policy "public read orgs" on orgs for select using (true);
drop policy if exists "public read gallery" on gallery;
create policy "public read gallery" on gallery for select using (true);

-- public can submit RSVPs + contact messages (insert only)
drop policy if exists "public insert rsvps" on rsvps;
create policy "public insert rsvps" on rsvps for insert with check (true);
drop policy if exists "public insert inbox" on inbox;
create policy "public insert inbox" on inbox for insert with check (true);

-- realtime for live updates
do $$ begin
  alter publication supabase_realtime add table events;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table announcements;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table orgs;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table gallery;
exception when duplicate_object then null; end $$;

-- seed orgs from current db.json (run once)
insert into orgs (id, name, advisor, members, day, "desc") values
 ('robotics','Robotics Team','Mr. Chen',42,'Tuesdays 3:30pm, Lab 3','Arduino, line-followers and regional comps. Beginners welcome.'),
 ('debate','Debate Society','Ms. Okafor',31,'Thursdays 4pm, Room 112','Parliamentary debate, novice sparring first month.'),
 ('art','Art & Mural Club','Ms. Rivera',27,'Wednesdays 3pm, Art Room','Murals, exhibits and weekend sketch walks.'),
 ('science','Science Circle','Dr. Patel',35,'Fridays 3pm, Lab 1','Fairs, olympiads and field trips.'),
 ('music','Music Ensemble','Mr. Santos',48,'Mon/Wed 4pm, Hall A','Choir + band, winter concert Dec 12.'),
 ('eco','Eco Warriors','Ms. Dela Cruz',29,'Saturdays 8am, Gate','Clean-ups, garden and recycling drive.')
on conflict (id) do nothing;
