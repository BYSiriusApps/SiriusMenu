import Image from "next/image";

// SiriusMenu marka logosu (public/logo.png, 997x220). Yükseklik verilir, genişlik orandan hesaplanır.
export function Logo({ height = 32, priority = false }: { height?: number; priority?: boolean }) {
  return (
    <Image
      src="/logo.png"
      alt="SiriusMenu"
      width={Math.round((height * 997) / 220)}
      height={height}
      priority={priority}
      style={{ height, width: "auto" }}
    />
  );
}
