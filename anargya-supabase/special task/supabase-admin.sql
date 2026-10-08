create table if not exists public.admins (email text primary key);
alter table public.admins enable row level security;  -- tanpa policy: tidak bisa dibaca dari browser

insert into public.admins (email) values (lower('anargya@admin.com'))
on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.orders add column if not exists restocked boolean not null default false;
alter table public.orders alter column status set default 'Pending';
update public.orders set status = 'Pending' where status = 'new';

drop policy if exists "products admin insert" on public.products;
drop policy if exists "products admin update" on public.products;
drop policy if exists "products admin delete" on public.products;
create policy "products admin insert" on public.products for insert to authenticated with check (public.is_admin());
create policy "products admin update" on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "products admin delete" on public.products for delete to authenticated using (public.is_admin());

drop policy if exists "orders admin select" on public.orders;
drop policy if exists "orders admin update" on public.orders;
drop policy if exists "orders admin delete" on public.orders;
create policy "orders admin select" on public.orders for select to authenticated using (public.is_admin());
create policy "orders admin update" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "orders admin delete" on public.orders for delete to authenticated using (public.is_admin());

drop policy if exists "order_items admin select" on public.order_items;
create policy "order_items admin select" on public.order_items for select to authenticated using (public.is_admin());