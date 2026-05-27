/** Local brand photography — /public/images/gallery */
const g = (n: string) => `/images/gallery/${n}.png`;

export const BRAND_IMAGES = {
  hero: g("05"),
  about: g("13"),
  logoMark: g("02"),
} as const;

export const GALLERY_IMAGE_PATHS = [
  { file: "02", alt: "Abstract French manicure with mint and pink accents", category: "nails" as const, span: "tall" as const },
  { file: "03", alt: "3D swirl nail art in vibrant colors", category: "nails" as const },
  { file: "04", alt: "3D floral nail art with nude and yellow tips", category: "nails" as const, span: "tall" as const },
  { file: "05", alt: "Cream pink French manicure", category: "nails" as const },
  { file: "06", alt: "Iridescent bow and rhinestone nail design", category: "nails" as const },
  { file: "07", alt: "Floral 3D nail art with gold accents", category: "nails" as const, span: "wide" as const },
  { file: "08", alt: "Checkerboard star nail art", category: "nails" as const },
  { file: "09", alt: "Winter snowflake and bow nail design", category: "nails" as const },
  { file: "10", alt: "Valentine hearts nail art", category: "nails" as const },
  { file: "11", alt: "Holiday festive nail art", category: "nails" as const },
  { file: "12", alt: "Gold gem stiletto luxury nails", category: "nails" as const, span: "tall" as const },
  { file: "13", alt: "Professional 3D floral manicure at K&K", category: "clients" as const },
  { file: "01", alt: "Pink marble French tip manicure", category: "nails" as const },
];

export const INSTAGRAM_IMAGES = ["02", "05", "06", "04", "12", "07", "10", "11", "01"].map(g);
