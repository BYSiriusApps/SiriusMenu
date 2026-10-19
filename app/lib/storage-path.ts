// menu-photos bucket yolları "<restaurant_id>/<...>" biçimindedir. Sunucu bu yolları service role ile
// okuyup yazdığı için, istemciden gelen yolun yalnızca başlangıcını kontrol etmek yetmez:
// "<kendi id>/../<başka id>/..." gibi bir yol URL normalizasyonunda başka işletmenin klasörüne çıkar.
const SEGMENT = /^[A-Za-z0-9._:%-]+$/;

function isDotSegment(seg: string): boolean {
  let decoded = seg;
  try { decoded = decodeURIComponent(seg); } catch { return true; }
  return seg === "." || seg === ".." || decoded === "." || decoded === ".." || decoded.includes("/") || decoded.includes("\\");
}

export function isOwnedPhotoPath(path: unknown, restaurantId: string): path is string {
  if (typeof path !== "string" || path.length > 300) return false;
  const parts = path.split("/");
  if (parts.length < 2 || parts[0] !== restaurantId) return false;
  return parts.every((seg) => SEGMENT.test(seg) && !isDotSegment(seg));
}
