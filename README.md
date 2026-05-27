# K&K Nails and Spa

A modern luxury website for **K&K Nails and Spa** — Folcroft, Pennsylvania's premium nail salon and spa experience.

## Features

- **Homepage** — Full-screen hero, about, services & pricing, gallery, testimonials, Instagram-style feed, contact with Google Maps, promo banner
- **Online booking** — Multi-step flow with calendar, real-time availability, technician selection, confirmation emails
- **Manage appointments** — Cancel or reschedule via confirmation ID
- **Admin dashboard** — View bookings, customer database, block time slots, manage technicians
- **Design** — Soft pink, nude beige, gold accents; light/dark luxury themes; Framer Motion animations
- **SEO** — Local salon keywords, sitemap, robots.txt, Open Graph metadata

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- Local JSON persistence (Supabase-ready)

## Getting Started

```bash
cd kk-nails-spa
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/book` | Online booking + manage appointment |
| `/admin` | Admin dashboard (key: `kk-admin-2026` by default) |

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
ADMIN_SECRET=your-secure-key
RESEND_API_KEY=          # Optional — sends real confirmation emails
RESEND_FROM_EMAIL=
```

## Booking System

- **30-minute** appointment intervals
- **Hours:** Mon–Sat 9 AM–7 PM, Sun 10 AM–5 PM (booking engine)
- **Double-booking prevention** per technician
- **Blocked slots** via admin dashboard
- Sample bookings seed on first API call

## Business Information

- **Address:** 1860 Delmar Drive, Folcroft, PA 19032
- **Phone:** 610-586-7078
- **Display hours:** Mon–Fri 10–7, Sat 9–6, Sun 11–4

## Production

```bash
npm run build
npm start
```

Deploy to Vercel, Netlify, or any Node.js host. Update `sitemap.ts` and `robots.ts` with your production domain.

## License

Private — K&K Nails and Spa
