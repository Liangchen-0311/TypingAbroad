create table if not exists public.payment_orders (
  order_id text primary key,
  uid text not null,
  plan_id text not null check (plan_id in ('half-year', 'lifetime')),
  provider text not null check (provider = 'alipay'),
  amount_fen integer not null check (amount_fen > 0),
  currency text not null default 'CNY' check (currency = 'CNY'),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'closed')),
  alipay_trade_no text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists payment_orders_uid_created_idx
  on public.payment_orders (uid, created_at desc);

create table if not exists public.memberships (
  uid text primary key,
  tier text not null default 'member' check (tier = 'member'),
  plan_id text not null check (plan_id in ('half-year', 'lifetime')),
  expires_at timestamptz,
  lifetime boolean not null default false,
  last_order_id text not null references public.payment_orders(order_id),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_events (
  event_id text primary key,
  provider text not null check (provider = 'alipay'),
  order_id text not null references public.payment_orders(order_id),
  trade_no text not null,
  received_at timestamptz not null default now()
);

alter table public.payment_orders enable row level security;
alter table public.memberships enable row level security;
alter table public.payment_events enable row level security;

revoke all on public.payment_orders from anon, authenticated;
revoke all on public.memberships from anon, authenticated;
revoke all on public.payment_events from anon, authenticated;
grant all on public.payment_orders to service_role;
grant all on public.memberships to service_role;
grant all on public.payment_events to service_role;

create or replace function public.activate_membership_order(
  p_order_id text,
  p_trade_no text,
  p_event_id text,
  p_paid_at timestamptz
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order public.payment_orders%rowtype;
  v_member public.memberships%rowtype;
  v_expires_at timestamptz;
begin
  select * into v_order
  from public.payment_orders
  where order_id = p_order_id
  for update;

  if not found then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  if v_order.status = 'paid' then
    select * into v_member from public.memberships where uid = v_order.uid;
    return jsonb_build_object('alreadyPaid', true, 'membership', to_jsonb(v_member));
  end if;

  if v_order.status <> 'pending' then
    raise exception 'ORDER_NOT_PAYABLE';
  end if;

  select * into v_member
  from public.memberships
  where uid = v_order.uid
  for update;

  if v_order.plan_id = 'lifetime' then
    insert into public.memberships (uid, tier, plan_id, expires_at, lifetime, last_order_id, updated_at)
    values (v_order.uid, 'member', 'lifetime', null, true, v_order.order_id, p_paid_at)
    on conflict (uid) do update set
      tier = 'member',
      plan_id = 'lifetime',
      expires_at = null,
      lifetime = true,
      last_order_id = excluded.last_order_id,
      updated_at = excluded.updated_at;
  elsif coalesce(v_member.lifetime, false) then
    update public.memberships set
      last_order_id = v_order.order_id,
      updated_at = p_paid_at
    where uid = v_order.uid;
  else
    v_expires_at := greatest(coalesce(v_member.expires_at, p_paid_at), p_paid_at) + interval '6 months';
    insert into public.memberships (uid, tier, plan_id, expires_at, lifetime, last_order_id, updated_at)
    values (v_order.uid, 'member', 'half-year', v_expires_at, false, v_order.order_id, p_paid_at)
    on conflict (uid) do update set
      tier = 'member',
      plan_id = 'half-year',
      expires_at = excluded.expires_at,
      lifetime = false,
      last_order_id = excluded.last_order_id,
      updated_at = excluded.updated_at;
  end if;

  update public.payment_orders set
    status = 'paid',
    alipay_trade_no = p_trade_no,
    paid_at = p_paid_at,
    updated_at = p_paid_at
  where order_id = p_order_id;

  insert into public.payment_events (event_id, provider, order_id, trade_no, received_at)
  values (p_event_id, 'alipay', p_order_id, p_trade_no, p_paid_at)
  on conflict (event_id) do nothing;

  select * into v_member from public.memberships where uid = v_order.uid;
  return jsonb_build_object('alreadyPaid', false, 'membership', to_jsonb(v_member));
end;
$$;

revoke all on function public.activate_membership_order(text, text, text, timestamptz) from public, anon, authenticated;
grant execute on function public.activate_membership_order(text, text, text, timestamptz) to service_role;
