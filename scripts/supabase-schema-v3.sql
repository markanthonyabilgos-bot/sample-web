-- Phase 3 tables: polls, votes, reactions, newsletter. Safe to re-run.
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
alter table polls enable row level security;
alter table poll_votes enable row level security;
alter table reactions enable row level security;
alter table newsletter enable row level security;
drop policy if exists "public read polls" on polls;
create policy "public read polls" on polls for select using (true);
drop policy if exists "public vote" on poll_votes;
create policy "public vote" on poll_votes for insert with check (true);
drop policy if exists "public read votes" on poll_votes;
create policy "public read votes" on poll_votes for select using (true);
drop policy if exists "public react" on reactions;
create policy "public react" on reactions for insert with check (true);
drop policy if exists "public read reactions" on reactions;
create policy "public read reactions" on reactions for select using (true);
drop policy if exists "public subscribe" on newsletter;
create policy "public subscribe" on newsletter for insert with check (true);
do $$ begin
  alter publication supabase_realtime add table polls;
exception when duplicate_object then null; end $$;
-- Storage bucket for photo uploads (run once; ignore if exists)
insert into storage.buckets (id, name, public) values ('photos', 'photos', true)
on conflict (id) do nothing;
-- public read on photos bucket
drop policy if exists "public read photos" on storage.objects;
create policy "public read photos" on storage.objects for select using (bucket_id = 'photos');
-- seed poll
insert into polls (id, question, options, active) values
 ('p1', 'What should the next clean-up target?', '["Riverside Park", "School Garden", "Library Drive", "Beach Front"]', true)
on conflict (id) do nothing;
