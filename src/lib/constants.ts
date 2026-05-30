import type { GalleryItem, Service, Technician } from "@/types";
import { GALLERY_IMAGE_PATHS } from "./images";

export const BRAND = {
  name: "K&K Nails and Spa",
  tagline: "Nails & Spa Care in Folcroft",
  phone: "610-586-7078",
  phoneRaw: "6105867078",
  email: "hello@kknailsandspa.us",
  address: "1860 Delmar Drive",
  city: "Folcroft",
  state: "PA",
  zip: "19032",
  fullAddress: "1860 Delmar Drive, Folcroft, PA 19032",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3058.2!2d-75.28!3d39.89!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDUzJzI0LjAiTiA3NcKwMTYnNDguMCJX!5e0!3m2!1sen!2sus!4v1",
  instagram: "https://www.instagram.com/kk_nailsand_spa",
  instagramHandle: "@kk_nailsand_spa",
  facebook: "https://facebook.com",
  hoursDisplay: [
    { days: "Monday – Friday", time: "10:00 AM – 7:00 PM" },
    { days: "Saturday", time: "9:00 AM – 6:00 PM" },
    { days: "Sunday", time: "11:00 AM – 4:00 PM" },
  ],
};

/** Booking engine hours (per product spec) */
export const BOOKING_HOURS = {
  weekday: { open: 9, close: 19 },
  saturday: { open: 9, close: 19 },
  sunday: { open: 10, close: 17 },
};

export const SHOP_TIME_ZONE = "America/New_York";
export const SLOT_INTERVAL_MINUTES = 30;
export const BOOKING_SLOT_MINUTES = 30;

export const SERVICES: Service[] = [
  { id: "mani-classic", name: "Classic Manicure", category: "manicure", price: 20 },
  { id: "mani-spa", name: "Spa Manicure", category: "manicure", price: 30 },
  { id: "mani-gel", name: "Signature Gel Manicure", category: "gel", price: 45 },
  { id: "mani-gel-french", name: "Gel French Manicure", category: "gel", price: 40 },
  { id: "pedi-classic", name: "Classic Pedicure", category: "pedicure", price: 35 },
  { id: "pedi-spa", name: "Spa Pedicure", category: "pedicure", price: 45 },
  { id: "pedi-gel", name: "Gel Color Pedicure", category: "pedicure", price: 45 },
  { id: "pedi-gel-french", name: "Gel French Pedicure", category: "pedicure", price: 50 },
  { id: "acrylic-full", name: "Acrylic Full Set", category: "acrylic", price: 40, priceLabel: "$40 & up" },
  { id: "acrylic-refill", name: "Acrylic Refill", category: "acrylic", price: 30, priceLabel: "$30 & up" },
  { id: "acrylic-gel", name: "Acrylic with Gel", category: "acrylic", price: 50, priceLabel: "$50 & up" },
  { id: "dip-mani", name: "Dip Powder with Mani", category: "dip", price: 50, priceLabel: "$50 & up" },
  { id: "dip-french", name: "Dip Powder French", category: "dip", price: 60, priceLabel: "$60 & up" },
  { id: "gel-liquid", name: "Liquid Gel Full Set", category: "gel", price: 60, priceLabel: "$60 & up" },
  { id: "nail-art-design", name: "Nail Art & Design", category: "nail-art", price: 15, priceLabel: "$5 & up" },
  { id: "wax-brows", name: "Eyebrow Wax", category: "waxing", price: 8 },
  { id: "wax-lip", name: "Upper Lip Wax", category: "waxing", price: 7 },
  { id: "wax-full-face", name: "Full Face Wax", category: "waxing", price: 40, priceLabel: "$40 & up" },
  { id: "wax-brazilian", name: "Brazilian Wax", category: "waxing", price: 55, priceLabel: "$55 & up" },
  { id: "lash-stripe", name: "Stripe Lashes", category: "eyelash", price: 20 },
  { id: "lash-individual", name: "Individual Lashes (Natural)", category: "eyelash", price: 35 },
  { id: "lash-thick", name: "Individual Lashes (Thick)", category: "eyelash", price: 60 },
  { id: "spa-duo", name: "Mani + Pedi Spa Package", category: "spa", price: 70 },
  { id: "spa-relaxation", name: "Relaxation Spa Package", category: "spa", price: 95 },
];

export const SERVICE_CATEGORIES: { id: string; label: string }[] = [
  { id: "manicure", label: "Manicure" },
  { id: "pedicure", label: "Pedicure" },
  { id: "gel", label: "Gel Nails" },
  { id: "acrylic", label: "Acrylic Nails" },
  { id: "dip", label: "Dip Powder" },
  { id: "nail-art", label: "Nail Art" },
  { id: "waxing", label: "Waxing" },
  { id: "eyelash", label: "Eyelash Extensions" },
  { id: "spa", label: "Spa Packages" },
];

export const TECHNICIANS: Technician[] = [
  { id: "kim", name: "Kim", title: "Lead Nail Artist", specialties: ["Gel", "Acrylic", "Nail Art"], active: true },
  { id: "kelly", name: "Kelly", title: "Senior Technician", specialties: ["Dip Powder", "Spa Mani/Pedi"], active: true },
  { id: "sophia", name: "Sophia", title: "Lash & Wax Specialist", specialties: ["Eyelashes", "Waxing"], active: true },
  { id: "mia", name: "Mia", title: "Junior Technician", specialties: ["Manicure", "Pedicure"], active: true },
];

export const GALLERY_ITEMS: GalleryItem[] = GALLERY_IMAGE_PATHS.map((item, i) => ({
  id: String(i + 1),
  src: `/images/gallery/${item.file}`,
  alt: item.alt,
  category: item.category,
  ...(item.span ? { span: item.span } : {}),
}));

export const NAV_LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#contact", label: "Contact" },
];



