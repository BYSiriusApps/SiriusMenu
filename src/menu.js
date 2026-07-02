import { supabase } from './supabaseClient.js';

const MEAT_TYPE_LABELS = {
  dana: 'Dana',
  kuzu: 'Kuzu',
  kanatli: 'Kanatlı',
  yok: 'Et İçermez',
};

function renderItem(item) {
  const meatLabel = item.meat_type ? MEAT_TYPE_LABELS[item.meat_type] ?? item.meat_type : null;
  const allergens = item.allergens ?? [];
  const ingredients = item.ingredients ?? [];

  const badges = [
    meatLabel ? `<span class="badge badge-meat">${meatLabel}</span>` : '',
    item.contains_alcohol ? '<span class="badge badge-warning">Alkol İçerir</span>' : '',
    item.contains_pork ? '<span class="badge badge-warning">Domuz Türevi İçerir</span>' : '',
  ].join('');

  return `
    <article class="menu-item">
      ${item.image_url ? `<img class="menu-item-image" src="${item.image_url}" alt="${item.name}" loading="lazy" />` : ''}
      <div class="menu-item-body">
        <div class="menu-item-header">
          <h3>${item.name}</h3>
          <span class="menu-item-price">${Number(item.price).toFixed(2)} ₺</span>
        </div>
        <div class="menu-item-badges">${badges}</div>
        ${item.calories ? `<p class="menu-item-calories">${item.calories} kcal / porsiyon</p>` : ''}
        ${ingredients.length ? `<p class="menu-item-ingredients"><strong>İçindekiler:</strong> ${ingredients.join(', ')}</p>` : ''}
        ${allergens.length ? `<p class="menu-item-allergens"><strong>Alerjenler:</strong> ${allergens.join(', ')}</p>` : ''}
      </div>
    </article>
  `;
}

function renderCategory(category, items) {
  return `
    <section class="menu-category">
      <h2>${category || 'Diğer'}</h2>
      <div class="menu-items">${items.map(renderItem).join('')}</div>
    </section>
  `;
}

function groupByCategory(items) {
  const groups = new Map();
  for (const item of items) {
    const key = item.category || 'Diğer';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return groups;
}

async function loadMenu() {
  const root = document.getElementById('menu-root');
  if (!root) return;

  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_published', true)
    .order('category', { ascending: true });

  if (error) {
    root.innerHTML = `<p class="menu-error">Menü yüklenemedi: ${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    root.innerHTML = '<p class="menu-empty">Menü henüz yayınlanmadı.</p>';
    return;
  }

  const groups = groupByCategory(data);
  root.innerHTML = Array.from(groups.entries())
    .map(([category, items]) => renderCategory(category, items))
    .join('');
}

loadMenu();
