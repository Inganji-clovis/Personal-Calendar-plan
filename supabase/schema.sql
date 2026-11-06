-- Run only if these tables have not already been created.
-- Your current project already has these four tables and RLS policies.
-- This file is a reference schema for a fresh project.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  name text not null, description text, status text not null default 'planned',
  start_date date, end_date date, created_at timestamptz default now()
);
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  title text not null, description text, status text not null default 'pending',
  priority text not null default 'medium', due_date date, created_at timestamptz default now()
);
create table if not exists public.learning_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  subject text not null, activity text, hours numeric(6,2) default 0,
  notes text, evidence_url text, completed_at date, created_at timestamptz default now()
);
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  type text not null check (type in ('income','expense')),
  amount numeric(14,2) not null check (amount > 0),
  category text not null, description text,
  transaction_date date not null default current_date, created_at timestamptz default now()
);
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.learning_records enable row level security;
alter table public.transactions enable row level security;
