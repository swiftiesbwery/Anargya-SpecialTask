-- Anargya ITS EV Team - Supabase schema
-- Paste this entire file into Supabase SQL Editor > New snippet, then Run.

create extension if not exists pgcrypto;

drop function if exists public.place_order(jsonb, jsonb, text);

drop table if exists public.orders cascade;
drop table if exists public.products cascade;

create table public.products (
  id text primary key,
  name text not null,
  price integer not null check (price >= 0),
  category text not null default 'Other',
  stock integer not null default 0 check (stock >= 0),
  sizes jsonb not null default '[]'::jsonb,
  "desc" text not null default '',
  image text not null default '',
  created_at timestamptz not null default now()
);

create table public.orders (
  id text primary key,
  customer jsonb not null,
  items jsonb not null,
  total integer not null check (total >= 0),
  payment text not null,
  status text not null default 'Pending' check (status in ('Pending','Paid','Shipped','Completed','Cancelled')),
  restocked boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;

create policy "Public can view products" on public.products for select to anon, authenticated using (true);
create policy "Admins can insert products" on public.products for insert to authenticated with check (true);
create policy "Admins can update products" on public.products for update to authenticated using (true) with check (true);
create policy "Admins can delete products" on public.products for delete to authenticated using (true);

create policy "Admins can view orders" on public.orders for select to authenticated using (true);
create policy "Admins can update orders" on public.orders for update to authenticated using (true) with check (true);
create policy "Admins can delete orders" on public.orders for delete to authenticated using (true);

-- Public checkout RPC. It validates stock and calculates the total on the server.
create or replace function public.place_order(p_customer jsonb, p_items jsonb, p_payment text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  it jsonb;
  prod public.products%rowtype;
  qty integer;
  requested_size text;
  final_items jsonb := '[]'::jsonb;
  final_total integer := 0;
  order_id text;
  inserted_order public.orders%rowtype;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty';
  end if;

  for it in select * from jsonb_array_elements(p_items) loop
    qty := greatest(1, (it->>'qty')::integer);
    requested_size := coalesce(it->>'size','');

    select * into prod from public.products where id = it->>'id' for update;
    if not found then raise exception 'Product not found: %', it->>'id'; end if;
    if prod.stock < qty then raise exception 'Not enough stock for %', prod.name; end if;
    if jsonb_array_length(prod.sizes) > 0 and not (prod.sizes ? requested_size) then
      raise exception 'Invalid size for %', prod.name;
    end if;

    final_total := final_total + prod.price * qty;
    final_items := final_items || jsonb_build_array(jsonb_build_object(
      'id', prod.id, 'name', prod.name, 'size', requested_size, 'qty', qty, 'price', prod.price
    ));

    update public.products set stock = stock - qty where id = prod.id;
  end loop;

  order_id := 'AG-' || upper(substr(md5(gen_random_uuid()::text), 1, 6));
  insert into public.orders(id, customer, items, total, payment)
  values(order_id, p_customer, final_items, final_total, coalesce(nullif(p_payment,''),'Bank transfer'))
  returning * into inserted_order;

  return jsonb_build_object(
    'id', inserted_order.id, 'date', inserted_order.created_at, 'customer', inserted_order.customer,
    'items', inserted_order.items, 'total', inserted_order.total, 'payment', inserted_order.payment,
    'status', inserted_order.status, 'restocked', inserted_order.restocked
  );
end;
$$;

revoke all on function public.place_order(jsonb, jsonb, text) from public;
grant execute on function public.place_order(jsonb, jsonb, text) to anon, authenticated;

insert into public.products (id,name,price,category,stock,sizes,"desc",image) values
('p22', '8th GEN Keychain', 15000, 'Collectibles', 100, '[]'::jsonb, 'Keychain celebrating the 8th generation of the Anargya team.', 'assets/shop/keychain-8th-gen.jpg'),
('p21', 'Anargya T-Shirt Black "History"', 130000, 'Apparel', 50, '["S","M","L","XL","XXL"]'::jsonb, 'Black Anargya tee from the "History" collection. Soft cotton, made to carry the story of the team.', 'assets/shop/tee-history-black.jpg'),
('p20', 'Anargya T-Shirt White "History"', 130000, 'Apparel', 50, '["S","M","L","XL","XXL"]'::jsonb, 'White Anargya tee from the "History" collection. Soft cotton, made to carry the story of the team.', 'assets/shop/tee-history-white.jpg'),
('p19', 'Anargya Strap', 20000, 'Accessories', 100, '[]'::jsonb, 'Anargya strap in team colors. A simple way to carry your keys, ID or badge.', 'assets/shop/anargya-strap.jpg'),
('p18', 'Keychain F1 Chill Guys', 15000, 'Collectibles', 100, '[]'::jsonb, 'F1 Chill Guys keychain. Relaxed on the outside, racing on the inside.', 'assets/shop/keychain-f1-chillguys.jpg'),
('p17', 'Gold Thunder Jersey', 125000, 'Apparel', 40, '["S","M","L","XL","XXL"]'::jsonb, 'The Anargya team jersey in the Gold Thunder edition. Lightweight, breathable and made to be worn on and off the track.', 'assets/shop/jersey-gold-thunder.jpg'),
('p16', 'ANR 2025 Workshirt', 160000, 'Apparel', 30, '["S","M","L","XL","XXL"]'::jsonb, 'The ANR 2025 workshirt, the crew shirt for garage days and race weekends. Built tough, with the Anargya mark.', 'assets/shop/workshirt-2025.jpg'),
('p15', 'Mark 4.0 T-Shirt Black', 115000, 'Apparel', 50, '["S","M","L","XL","XXL"]'::jsonb, 'Black cotton tee celebrating the Mark 4.0 car. Dark, bold, built for night runs.', 'assets/shop/tee-mark4-black.jpg'),
('p14', 'Keychain ANR Mark 1-4', 15000, 'Collectibles', 100, '[]'::jsonb, 'Keychain from the ANR Mark 1 to Mark 4 series. Collect the cars that started it all.', 'assets/shop/keychain-mark1-4.jpg'),
('p7', 'ANR Tee Black', 149000, 'Apparel', 60, '["S","M","L","XL","XXL"]'::jsonb, 'Dark, bold, built for night runs. Heavy cotton tee in black with the rising-sun car print on the chest and katakana "Champion" lettering.', 'assets/shop/tee-black.jpg'),
('p8', 'ANR Tee White', 149000, 'Apparel', 60, '["S","M","L","XL","XXL"]'::jsonb, 'Clean lines, sharp looks, built to stand out. Soft white cotton tee with the Anargya car and red sun on the chest.', 'assets/shop/tee-white.jpg'),
('p9', 'Mark 4.0 Back-Print Tee', 179000, 'Apparel', 35, '["S","M","L","XL","XXL"]'::jsonb, 'White tee with a full-size Mark 4.0 race photo print on the back and a small Mark 4.0 tag on the chest. Which crew you ride with?', 'assets/shop/tee-mark4.jpg'),
('p10', 'Pit Lanyard', 45000, 'Accessories', 80, '[]'::jsonb, 'Woven black lanyard with Anargya ITS Formula EV Team lettering, green racing stripes and a metal clip. Garage essentials, pocket-sized.', 'assets/shop/lanyard.jpg'),
('p11', 'Driver Acrylic Keychain', 35000, 'Collectibles', 90, '[]'::jsonb, 'Double-sided acrylic keychain of the Anargya driver in a green-visor helmet. Pairs with the Pit Lanyard.', 'assets/shop/keychain.jpg'),
('p4', 'Sticker Pack', 10000, 'Accessories', 100, '[]'::jsonb, 'Set of weatherproof stickers for laptops and helmets.', 'assets/shop/sticker-pack.jpg')
on conflict (id) do update set
  name=excluded.name, price=excluded.price, category=excluded.category, sizes=excluded.sizes, "desc"=excluded."desc", image=excluded.image;
