-- Run this in Supabase SQL Editor. Enables realtime editing for events + news.
create table if not exists events (id text primary key, title text not null, date text not null, place text, org text);
create table if not exists announcements (id text primary key, title text not null, body text, date text);

alter table events enable row level security;
alter table announcements enable row level security;

drop policy if exists "public read" on events;
create policy "public read" on events for select using (true);
drop policy if exists "public write" on events;
create policy "public write" on events for all using (true) with check (true);

drop policy if exists "public read" on announcements;
create policy "public read" on announcements for select using (true);
drop policy if exists "public write" on announcements;
create policy "public write" on announcements for all using (true) with check (true);

-- Realtime
alter publication supabase_realtime add table events;
alter publication supabase_realtime add table announcements;

-- Seed (run once)
insert into events (id,title,date,place,org) values
 ('e1','Club Fair','2026-09-22','Covered Court','All clubs'),
 ('e2','Robotics Open Build','2026-09-23','Lab 3','Robotics Team'),
 ('e3','Debate Tryouts','2026-09-25','Room 112','Debate Society'),
 ('e4','Riverside Clean-up','2026-09-27','School Gate','Eco Warriors')
on conflict (id) do nothing;
