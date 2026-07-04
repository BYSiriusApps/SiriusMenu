// Vercel Serverless Function — ürün ekleme/düzenleme/silme için admin yazma API'si.
//
// GÜVENLİK: Bu dosya SUPABASE_SERVICE_ROLE_KEY ve ADMIN_API_KEY ortam
// değişkenlerini kullanır. Bu iki değer YALNIZCA Vercel Environment Variables
// üzerinden tanımlanır, asla .env dosyasına veya repoya girmez, asla
// VITE_ öneki taşımaz (bkz. restoran-siparis-sistemi/guvenlik-ve-mimari-rehberi.md §2-3).
//
// Yetkilendirme: her istek `x-admin-key` header'ında ADMIN_API_KEY değerini
// taşımak zorundadır; eşleşmezse 401 döner.

import { createClient } from '@supabase/supabase-js';

const MEAT_TYPES = ['dana', 'kuzu', 'kanatli', 'yok'];

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY ortam değişkenleri tanımlı değil.');
  }
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}

// yasal-uyum-rehberi.md §5 şemasındaki zorunlu alanları doğrular.
function validateMenuItem(body, { partial = false } = {}) {
  const errors = [];
  const required = (field) => {
    if (body[field] === undefined) errors.push(`'${field}' alanı zorunludur.`);
  };

  if (!partial) {
    ['name', 'price', 'meat_type', 'calories', 'ingredients', 'allergens', 'contains_alcohol', 'contains_pork'].forEach(required);
  }

  if (body.name !== undefined && (typeof body.name !== 'string' || !body.name.trim())) {
    errors.push("'name' boş olamaz.");
  }
  if (body.price !== undefined && !(typeof body.price === 'number' && body.price >= 0)) {
    errors.push("'price' sıfır veya pozitif bir sayı olmalı.");
  }
  if (body.meat_type !== undefined && !MEAT_TYPES.includes(body.meat_type)) {
    errors.push(`'meat_type' şunlardan biri olmalı: ${MEAT_TYPES.join(', ')}`);
  }
  if (body.calories !== undefined && !(typeof body.calories === 'number' && body.calories >= 0)) {
    errors.push("'calories' sıfır veya pozitif bir sayı olmalı (porsiyon başına kcal).");
  }
  if (body.ingredients !== undefined && !Array.isArray(body.ingredients)) {
    errors.push("'ingredients' bir dizi olmalı (temel bileşen/hammadde listesi).");
  }
  if (body.allergens !== undefined && !Array.isArray(body.allergens)) {
    errors.push("'allergens' bir dizi olmalı (alerjen içermiyorsa boş dizi gönderin).");
  }
  if (body.contains_alcohol !== undefined && typeof body.contains_alcohol !== 'boolean') {
    errors.push("'contains_alcohol' boolean olmalı.");
  }
  if (body.contains_pork !== undefined && typeof body.contains_pork !== 'boolean') {
    errors.push("'contains_pork' boolean olmalı.");
  }

  return errors;
}

function isAuthorized(req) {
  const adminKey = process.env.ADMIN_API_KEY;
  return Boolean(adminKey) && req.headers['x-admin-key'] === adminKey;
}

export default async function handler(req, res) {
  if (!isAuthorized(req)) {
    res.status(401).json({ error: 'Yetkisiz istek: geçerli x-admin-key header gerekli.' });
    return;
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const query = supabase.from('menu_items').select('*').order('category', { ascending: true });
      const { data, error } = id ? await query.eq('id', id).maybeSingle() : await query;
      if (error) throw error;
      res.status(200).json({ data });
      return;
    }

    if (req.method === 'POST') {
      const errors = validateMenuItem(req.body);
      if (errors.length) {
        res.status(400).json({ errors });
        return;
      }
      const { data, error } = await supabase.from('menu_items').insert(req.body).select().single();
      if (error) throw error;
      res.status(201).json({ data });
      return;
    }

    if (req.method === 'PATCH' || req.method === 'PUT') {
      if (!id) {
        res.status(400).json({ error: "Güncelleme için '?id=' query parametresi gerekli." });
        return;
      }
      const errors = validateMenuItem(req.body, { partial: true });
      if (errors.length) {
        res.status(400).json({ errors });
        return;
      }
      const { data, error } = await supabase
        .from('menu_items')
        .update({ ...req.body, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      res.status(200).json({ data });
      return;
    }

    if (req.method === 'DELETE') {
      if (!id) {
        res.status(400).json({ error: "Silme için '?id=' query parametresi gerekli." });
        return;
      }
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
      res.status(204).end();
      return;
    }

    res.setHeader('Allow', 'GET, POST, PATCH, PUT, DELETE');
    res.status(405).json({ error: `Method ${req.method} desteklenmiyor.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
