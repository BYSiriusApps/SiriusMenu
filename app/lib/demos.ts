import type { MenuData } from "./menu";

// Landing showcase + /ornek için gömülü demo menüler (anahtarsız çalışır).
// Aynı içerik supabase/seed.sql ile /m/demo-* canlı sayfalarını besler.

export type Demo = { slug: string; tag: string; menu: MenuData };

const U = (id: string) => `https://images.unsplash.com/${id}?w=400&q=70`;

export const DEMOS: Demo[] = [
  {
    slug: "demo-kafe",
    tag: "Kafe",
    menu: {
      name: "Kahve Durağı", subtitle: "Üçüncü nesil kahve & ev yapımı tatlılar", theme: "kafe", currency: "₺",
      categories: [
        { id: 1, name: "Kahveler", items: [
          { id: 11, name: "Flat White", desc: "Çift shot espresso, kadifemsi süt", price: "95", tags: ["sef"], image: U("photo-1517701550927-30cf4ba1dba5") },
          { id: 12, name: "Filtre Kahve", desc: "Günün çekirdeği, V60", price: "80", tags: [], image: U("photo-1495474472287-4d71bcdd2085") },
          { id: 13, name: "Soğuk Demleme", desc: "18 saat demlenmiş, buzlu", price: "105", tags: ["yeni"], image: U("photo-1461023058943-07fcbe16d735") },
        ] },
        { id: 2, name: "Tatlılar", items: [
          { id: 21, name: "San Sebastian", desc: "Yanık cheesecake, tuzlu karamel", price: "140", tags: ["sef"], image: U("photo-1524351199678-941a58a3df50") },
          { id: 22, name: "Vegan Brownie", desc: "Çikolatalı, cevizli", price: "110", tags: ["vegan", "glutensiz"] },
        ] },
        { id: 3, name: "Atıştırmalıklar", items: [
          { id: 31, name: "Avokado Tost", desc: "Ekşi maya ekmek, kiraz domates, acı sos", price: "160", tags: ["aci"], image: U("photo-1588137378633-dea1336ce1e2") },
        ] },
      ],
    },
  },
  {
    slug: "demo-restoran",
    tag: "Restoran",
    menu: {
      name: "Meze & Mangal", subtitle: "Ege mezeleri ve odun ateşinde ızgara", theme: "klasik", currency: "₺",
      categories: [
        { id: 1, name: "Başlangıçlar", items: [
          { id: 11, name: "Humus", desc: "Nohut, tahin, zeytinyağı, kimyon", price: "120", tags: ["vegan"], image: U("photo-1637949385162-e416fb15b2ce") },
          { id: 12, name: "Haydari", desc: "Süzme yoğurt, ceviz, taze nane", price: "110", tags: [], image: U("photo-1601001435957-74f0958a93df") },
          { id: 13, name: "Sigara Böreği", desc: "El açması yufka, beyaz peynir", price: "130", tags: ["sef"], image: U("photo-1541014741259-de529411b96a") },
        ] },
        { id: 2, name: "Izgara", items: [
          { id: 21, name: "Adana Kebap", desc: "Zırh kıyma, közlenmiş biber ve domates", price: "320", tags: ["aci", "sef"], image: U("photo-1633945274405-b6c8069047b0") },
          { id: 22, name: "Kuzu Pirzola", desc: "Köz patlıcan püresi ile", price: "480", tags: [], image: U("photo-1544025162-d76694265947") },
          { id: 23, name: "Çöp Şiş", desc: "Küçük kuşbaşı kuzu, közde", price: "340", tags: ["yeni"], image: U("photo-1529193591184-b1d58069ecdd") },
        ] },
        { id: 3, name: "Tatlı", items: [
          { id: 31, name: "Künefe", desc: "Antep fıstığı, kaymak", price: "180", tags: ["sef"], image: U("photo-1610452271614-ec4d2f92b7b4") },
        ] },
      ],
    },
  },
  {
    slug: "demo-bar",
    tag: "Bar",
    menu: {
      name: "Gece Vardiyası", subtitle: "İmza kokteyller ve kadeh şarap", theme: "gece", currency: "₺",
      categories: [
        { id: 1, name: "İmza Kokteyller", items: [
          { id: 11, name: "Duman & Bal", desc: "İsli viski, bal, limon, ardıç", price: "420", tags: ["sef"], image: U("photo-1514362545857-3bc16c4c7d1b") },
          { id: 12, name: "Bahçe Sour", desc: "Cin, taze salatalık, fesleğen", price: "380", tags: ["yeni"], image: U("photo-1551024709-8f23befc6f87") },
          { id: 13, name: "Acı Paloma", desc: "Tekila, greyfurt, jalapeño", price: "390", tags: ["aci"], image: U("photo-1470337458703-46ad1756a187") },
        ] },
        { id: 2, name: "Kadeh Şarap", items: [
          { id: 21, name: "Narince", desc: "Tokat, beyaz, kuru kayısı notaları", price: "260", tags: [], image: U("photo-1510812431401-41d2bd2722f3") },
          { id: 22, name: "Öküzgözü", desc: "Elazığ, kırmızı, olgun kiraz", price: "280", tags: [] },
        ] },
        { id: 3, name: "Atıştırma", items: [
          { id: 31, name: "Peynir Tabağı", desc: "Yerel peynirler, bal, ceviz", price: "320", tags: ["sef"], image: U("photo-1452195100486-9cc805987862") },
          { id: 32, name: "Baharatlı Badem", desc: "Ev usulü kavrulmuş", price: "90", tags: ["vegan", "aci"] },
        ] },
      ],
    },
  },
  {
    slug: "demo-brunch",
    tag: "Brunch",
    menu: {
      name: "Brunch Sokak", subtitle: "Modern kahvaltı, özel burgerler ve taze sıkım", theme: "modern", currency: "₺",
      categories: [
        { id: 1, name: "Kahvaltı Tabakları", items: [
          { id: 11, name: "Serpme Kahvaltı", desc: "Peynir çeşitleri, zeytin, reçel, tereyağı, sınırsız çay", price: "280", tags: ["sef"], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/11.png" },
          { id: 12, name: "Avokadolu Yumurta", desc: "Ekşi maya ekmek, poşe yumurta, acı yağ", price: "165", tags: ["yeni"], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/12.png" },
          { id: 13, name: "Simit Waffle", desc: "Susamlı waffle, labne, bal", price: "145", tags: [], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/13.png" },
        ] },
        { id: 2, name: "Burgerler", items: [
          { id: 21, name: "Smash Burger", desc: "Double patty, cheddar, özel sos", price: "210", tags: ["sef"], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/21.png" },
          { id: 22, name: "Tavuklu Burger", desc: "Çıtır tavuk, turşu, acı mayonez", price: "190", tags: ["aci"], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/22.png" },
          { id: 23, name: "Vegan Burger", desc: "Nohut köftesi, avokado, marul", price: "175", tags: ["vegan"], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/23.png" },
        ] },
        { id: 3, name: "İçecekler", items: [
          { id: 31, name: "Taze Sıkım Portakal", desc: "Günlük sıkım", price: "90", tags: [], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/31.png" },
          { id: 32, name: "Cold Brew", desc: "18 saat demlenmiş", price: "95", tags: [], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/32.png" },
        ] },
      ],
    },
  },
  {
    slug: "demo-vegan",
    tag: "Vegan",
    menu: {
      name: "Kök", subtitle: "Bitki bazlı, mevsimlik ve doğal", theme: "bahce", currency: "₺",
      categories: [
        { id: 1, name: "Buddha Bowl'lar", items: [
          { id: 11, name: "Falafel Bowl", desc: "Nohut falafeli, humus, tahin sos, kinoa", price: "175", tags: ["vegan"], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/11.png" },
          { id: 12, name: "Tempeh Bowl", desc: "Marine tempeh, kavrulmuş sebze, esmer pirinç", price: "185", tags: ["vegan", "glutensiz"], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/12.png" },
        ] },
        { id: 2, name: "Ana Yemekler", items: [
          { id: 21, name: "Mantar Risotto", desc: "Kremalı arborio pirinç, kekik", price: "210", tags: ["sef", "glutensiz"], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/21.png" },
          { id: 22, name: "Sebzeli Curry", desc: "Nohut, ıspanak, hindistan cevizi sütü", price: "190", tags: ["aci", "vegan"], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/22.png" },
        ] },
        { id: 3, name: "Smoothie & İçecek", items: [
          { id: 31, name: "Yeşil Detoks", desc: "Ispanak, elma, zencefil, limon", price: "110", tags: ["vegan"], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/31.png" },
          { id: 32, name: "Kırmızı Meyve Smoothie", desc: "Yaban mersini, çilek, badem sütü", price: "115", tags: ["vegan", "yeni"], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/32.png" },
        ] },
      ],
    },
  },
  {
    slug: "demo-balik",
    tag: "Balık",
    menu: {
      name: "Liman", subtitle: "Günlük av, ızgara ve meze", theme: "deniz", currency: "₺",
      categories: [
        { id: 1, name: "Meze", items: [
          { id: 11, name: "Deniz Börülcesi", desc: "Zeytinyağlı, sarımsaklı", price: "130", tags: ["vegan"], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/11.png" },
          { id: 12, name: "Kalamar Tava", desc: "Çıtır kalamar, tartar sos", price: "220", tags: ["sef"], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/12.png" },
          { id: 13, name: "Midye Dolma", desc: "20 adet, limonlu", price: "180", tags: [], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/13.png" },
        ] },
        { id: 2, name: "Balıklar", items: [
          { id: 21, name: "Levrek Izgara", desc: "Günlük av, roka salatası ile", price: "380", tags: ["sef"], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/21.png" },
          { id: 22, name: "Çupra Buğulama", desc: "Sebzeli, zeytinyağlı", price: "360", tags: ["glutensiz"], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/22.png" },
          { id: 23, name: "Karides Güveç", desc: "Tereyağlı domates sos, kaşar", price: "340", tags: ["yeni"], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/23.png" },
        ] },
        { id: 3, name: "İçecek", items: [
          { id: 31, name: "Rakı (35cl)", desc: "Yeşil şişe", price: "450", tags: [], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/31.png" },
          { id: 32, name: "Beyaz Şarap Kadeh", desc: "Sarıgevrek, taze", price: "240", tags: [], image: "https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/32.png" },
        ] },
      ],
    },
  },
];
