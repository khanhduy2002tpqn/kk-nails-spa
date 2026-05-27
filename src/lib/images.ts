/** Local brand photography — /public/images/gallery */
const g = (name: string) => `/images/gallery/${name}`;

export const BRAND_IMAGES = {
  hero: g("05.png"),
  about: g("13.png"),
  logoMark: g("02.png"),
} as const;

export const GALLERY_IMAGE_PATHS = [
  { file: "02.png", alt: "Abstract French manicure with mint and pink accents", category: "nails" as const, span: "tall" as const },
  { file: "03.png", alt: "3D swirl nail art in vibrant colors", category: "nails" as const },
  { file: "04.png", alt: "3D floral nail art with nude and yellow tips", category: "nails" as const, span: "tall" as const },
  { file: "05.png", alt: "Cream pink French manicure", category: "nails" as const },
  { file: "06.png", alt: "Iridescent bow and rhinestone nail design", category: "nails" as const },
  { file: "07.png", alt: "Floral 3D nail art with gold accents", category: "nails" as const, span: "wide" as const },
  { file: "08.png", alt: "Checkerboard star nail art", category: "nails" as const },
  { file: "09.png", alt: "Winter snowflake and bow nail design", category: "nails" as const },
  { file: "10.png", alt: "Valentine hearts nail art", category: "nails" as const },
  { file: "11.png", alt: "Holiday festive nail art", category: "nails" as const },
  { file: "12.png", alt: "Gold gem stiletto luxury nails", category: "nails" as const, span: "tall" as const },
  { file: "13.png", alt: "Professional 3D floral manicure at K&K", category: "clients" as const },
  { file: "14.jpg", alt: "Salon interior and seating space", category: "interior" as const, span: "wide" as const },
  { file: "15.jpg", alt: "Reception and decoration area", category: "interior" as const },
  { file: "16.jpg", alt: "Relaxing spa corner inside the salon", category: "interior" as const },
  { file: "17.jpg", alt: "K&K Nails and Spa inside atmosphere", category: "interior" as const, span: "tall" as const },
  { file: "01.png", alt: "Pink marble French tip manicure", category: "nails" as const },
];

export const INSTAGRAM_IMAGES = ["02.png", "05.png", "06.png", "04.png", "12.png", "07.png", "10.png", "11.png", "01.png"].map(g);
