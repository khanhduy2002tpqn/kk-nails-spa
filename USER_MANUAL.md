# User Manual

## Overview

`K&K Nails and Spa` is a salon booking website that allows customers to view services, book appointments, and manage bookings online.

## Pages and Navigation

### Homepage (`/`)

- Browse salon services and pricing
- View the gallery and testimonials
- Find contact information and location details
- Click the Book button to start a reservation

### Booking Page (`/book`)

- Select a service and technician
- Choose a date and available time slot
- Enter contact details: name, phone, email
- Submit booking and receive confirmation

### Manage Booking

- Use the same booking page to manage an appointment
- Enter your confirmation ID or booking information to view and update your reservation

### Admin Dashboard (`/admin`)

- Access is protected by the admin key
- Use this area to view bookings, block slots, and manage salon availability

## Booking Process

1. Open the booking page.
2. Choose a service and technician.
3. Pick a date from the calendar.
4. Select an available time slot.
5. Enter your name, phone number, and email.
6. Confirm the booking.

After booking, you will receive a confirmation email with a booking ID and a link to manage your appointment.

## Booking Rules

- Appointments are scheduled in 30-minute increments.
- Salon hours are:
  - Monday–Saturday: 9:00 AM – 7:00 PM
  - Sunday: 10:00 AM – 5:00 PM
- The system prevents double-booking for the same technician.
- Blocked time slots are unavailable for customer booking.

## Managing an Appointment

- Open the booking management section.
- Provide your confirmation ID or booking details.
- Cancel or reschedule as allowed by the salon.

## Email Confirmation

- Confirmations are sent automatically when booking is successful.
- If email delivery is not configured, booking confirmation may be shown in the app or logged during development.

## Admin Instructions

- Navigate to `/admin` and enter the admin key.
- Review current bookings and technician schedules.
- Add or remove blocked slots to protect time for breaks or staff availability.
- Use the dashboard to keep appointment availability accurate.

## Support

For help with booking or rescheduling, contact the salon directly using the phone number shown on the website.
