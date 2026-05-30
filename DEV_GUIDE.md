# Developer Guide

## Project Overview

`kk-nails-spa` is a Next.js 16 application for a nail salon booking website. It includes:

- Public landing page with services, gallery, testimonials, and contact details
- Online booking flow with technician selection and real-time availability
- Appointment management via confirmation ID
- Admin dashboard for viewing bookings and blocked slots
- Email confirmation support using Resend API or console preview

## Setup

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a local environment file:

```bash
cp .env.example .env.local
```

4. Set required variables in `.env.local`:

```env
ADMIN_SECRET=your-secure-key
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.example.net/kk-nails-spa
RESEND_API_KEY=          # Optional for real email delivery
RESEND_FROM_EMAIL=
OWNER_BOOKING_EMAIL=    # Optional internal new-booking notification recipient
```

5. Run the app locally:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Project Structure

- `src/app/` — app routes, pages, API handlers
- `src/components/` — UI and feature components
- `src/lib/` — business logic, helpers, validation and data persistence
- `src/types/` — shared TypeScript interfaces
- `public/` — static assets and images
- `data/` — sample JSON data and seed helpers

## API Endpoints

- `GET /api/bookings` — list bookings
- `POST /api/bookings` — create a new booking
- `GET /api/availability` — get available slots
- `GET /api/bookings/[id]` — get or update booking by ID
- `GET /api/admin/blocked` — list blocked slots

## Important Code Paths

- `src/lib/booking-utils.ts` — slot generation and availability logic
- `src/lib/store.ts` — data persistence and seeding
- `src/app/api/bookings/route.ts` — booking POST/GET implementation
- `src/lib/validation.ts` — Zod booking schema validation
- `src/lib/email.ts` — confirmation email builder and sender

## Testing

### Test scripts

- `npm run test` — run all Vitest tests
- `npm run test:booking` — run booking utility tests only
- `npm run test:booking-api` — run booking API route tests only

### Test setup

The repository includes `vitest.config.ts` with alias support for `@/` imports and `node` test environment.

## Deployment

Build and start the app for production:

```bash
npm run build
npm start
```

Deploy to Vercel, Netlify, or any Node.js hosting provider. Make sure environment variables are configured for the production environment.

## Notes

- The booking engine enforces 30-minute intervals and prevents overlapping confirmed bookings.
- Admin access is available via the `/admin` page.
- If `RESEND_API_KEY` is not configured, the app logs email content in development.
