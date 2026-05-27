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
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; max-width:680px; margin:0 auto; padding:32px; background:#f6f6f8; color:#1f2937;">
  <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(31,41,55,0.06);">
    <div style="padding:28px 32px; border-bottom:1px solid #f0e9e6;">
      <h1 style="margin:0; font-size:20px; color:#b68536; font-weight:600;">${BRAND.name}</h1>
      <p style="margin:6px 0 0; color:#6b7280; font-size:13px;">${BRAND.tagline}</p>
    </div>
    <div style="padding:24px 32px;">
      <h2 style="margin:0 0 12px; font-size:16px; color:#111827;">Appointment Confirmed</h2>
      <p style="margin:0 0 16px; color:#374151; font-size:14px;">Hello <strong>${booking.customerName}</strong>, your appointment is confirmed. Below are the details:</p>

      <table style="width:100%; border-collapse:collapse; font-size:14px; color:#374151;">
        <tr>
          <td style="padding:8px 0; width:34%; color:#6b7280;">Service</td>
          <td style="padding:8px 0;"><strong>${booking.serviceName}</strong></td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#6b7280;">Technician</td>
          <td style="padding:8px 0;"><strong>${booking.technicianName}</strong></td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#6b7280;">Date</td>
          <td style="padding:8px 0;"><strong>${booking.date}</strong></td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#6b7280;">Time</td>
          <td style="padding:8px 0;"><strong>${booking.time}</strong></td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#6b7280;">Duration</td>
          <td style="padding:8px 0;"><strong>${booking.duration} minutes</strong></td>
        </tr>
      </table>

      <p style="margin:18px 0 0; font-size:13px; color:#6b7280;">If you need to cancel or reschedule, please reply to this email or visit our website and use your confirmation ID.</p>
    </div>

    <div style="padding:16px 32px; border-top:1px solid #f0e9e6; font-size:13px; color:#6b7280;">
      <div>${BRAND.fullAddress}</div>
      <div style="margin-top:6px">Phone: ${BRAND.phone}</div>
    </div>
    <div style="padding:20px 32px 36px; text-align:center; background:#f6f6f8;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://kk-nails-spa.vercel.app')}/book?id=${booking.id}" 
         style="display:inline-block; text-decoration:none; background:#b68536; color:white; padding:10px 18px; border-radius:8px; font-weight:600; font-size:14px;">
        Manage booking
      </a>
    </div>
  </div>
</div>`.trim();

  return { subject, html, text };
}

export async function sendConfirmationEmail(booking: Booking): Promise<boolean> {
  const { subject, text, html } = buildConfirmationEmail(booking);

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
          html,
          text,
        }),
      });
      //Check status code 2xx
      console.log("[Email API Response]", res.status, await res.text());
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
