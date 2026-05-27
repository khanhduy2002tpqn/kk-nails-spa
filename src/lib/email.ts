import { BRAND } from "./constants";
import type { Booking } from "@/types";

export function buildConfirmationEmail(booking: Booking): { subject: string; html: string; text: string } {
  const subject = `Appointment Confirmed — ${BRAND.name}`;
  const text = `
Hello ${booking.customerName},

Your appointment at ${BRAND.name} is confirmed!

Service: ${booking.serviceName}
Technician: ${booking.technicianName}
Date: ${booking.date}
Time: ${booking.time}
Duration: ${booking.duration} minutes

Location: ${BRAND.fullAddress}
Phone: ${BRAND.phone}

To cancel or reschedule, visit our website or call ${BRAND.phone}.

Thank you for choosing ${BRAND.name}!
${BRAND.tagline}
`.trim();

  const html = `
<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #F8E8EE; color: #2d2d2d;">
  <h1 style="color: #C9A962; font-size: 24px; margin-bottom: 8px;">${BRAND.name}</h1>
  <p style="font-style: italic; color: #888; margin-top: 0;">${BRAND.tagline}</p>
  <div style="background: white; border-radius: 12px; padding: 24px; margin-top: 24px; border: 1px solid #E8D5C4;">
    <h2 style="font-size: 18px; margin-top: 0;">Appointment Confirmed</h2>
    <p>Hello <strong>${booking.customerName}</strong>,</p>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #888;">Service</td><td style="padding: 8px 0;"><strong>${booking.serviceName}</strong></td></tr>
      <tr><td style="padding: 8px 0; color: #888;">Technician</td><td style="padding: 8px 0;"><strong>${booking.technicianName}</strong></td></tr>
      <tr><td style="padding: 8px 0; color: #888;">Date</td><td style="padding: 8px 0;"><strong>${booking.date}</strong></td></tr>
      <tr><td style="padding: 8px 0; color: #888;">Time</td><td style="padding: 8px 0;"><strong>${booking.time}</strong></td></tr>
    </table>
    <p style="margin-top: 24px; font-size: 14px; color: #666;">
      ${BRAND.fullAddress}<br/>
      ${BRAND.phone}
    </p>
  </div>
</div>`.trim();

  return { subject, html, text };
}

export async function sendConfirmationEmail(booking: Booking): Promise<boolean> {
  const { subject, text } = buildConfirmationEmail(booking);

  if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL,
          to: booking.customerEmail,
          subject,
          text,
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[Email Preview]", subject, "→", booking.customerEmail);
    console.log(text);
  }

  return true;
}
