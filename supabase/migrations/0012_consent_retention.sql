-- Hesap silinse bile satın alma sözleşme onay kayıtları yasal saklama süresi boyunca korunur
-- (bkz. KVKK aydınlatma metni, saklama süresi). Restoran silinince kayıt silinmez, bağ koparılır.
alter table public.purchase_consents alter column restaurant_id drop not null;
alter table public.purchase_consents drop constraint if exists purchase_consents_restaurant_id_fkey;
alter table public.purchase_consents
  add constraint purchase_consents_restaurant_id_fkey
  foreign key (restaurant_id) references public.restaurants(id) on delete set null;
