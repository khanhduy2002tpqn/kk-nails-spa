import { BRAND } from "./constants";
import { formatConfirmationId } from "./confirmation";
import type { Booking } from "@/types";

async function sendEmail(to: string, subject: string, html: string, text: string): Promise<boolean> {
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
          to,
          subject,
          html,
          text,
        }),
      });
      console.log("[Email API Response]", to, res.status, await res.text());
      return res.ok;
    } catch {
      return false;
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[Email Preview]", subject, "->", to);
    console.log(text);
  }

  return true;
}

export function buildConfirmationEmail(booking: Booking): { subject: string; html: string; text: string } {
  const subject = `Appointment Confirmed - ${BRAND.name}`;
  const appUrl = process.env.PUBLIC_URL;
  const manageUrl = `${appUrl}/manage?id=${booking.id}`;
  const confirmationIdText = formatConfirmationId(booking.id).join("\n");
  const confirmationIdHtml = formatConfirmationId(booking.id).join("<br />");
  const text = `
Hello ${booking.customerName},

Your appointment at ${BRAND.name} is confirmed!

Service: ${booking.serviceName}
Technician: ${booking.technicianName}
Date: ${booking.date}
Time: ${booking.time}
Confirmation ID:
${confirmationIdText}

Location: ${BRAND.fullAddress}
Phone: ${BRAND.phone}

To cancel or reschedule, use your confirmation ID plus the email or phone from this booking at ${manageUrl}, or call ${BRAND.phone}.

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
          <td style="padding:8px 0; color:#6b7280;">Confirmation ID</td>
          <td style="padding:8px 0;"><strong style="font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; line-height:1.6; white-space:nowrap;">${confirmationIdHtml}</strong></td>
        </tr>
      </table>

      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px auto 10px; border-collapse:separate;">
        <tr>
          <td bgcolor="#b68536" style="border-radius:8px; text-align:center;">
            <a href="${manageUrl}" target="_blank" rel="noopener noreferrer"
               style="display:block; padding:12px 20px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; font-size:14px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:8px;">
              Manage booking
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 18px; text-align:center; font-size:12px; color:#6b7280;">
        Link: <a href="${manageUrl}" target="_blank" rel="noopener noreferrer" style="color:#b68536; text-decoration:underline; word-break:break-all;">${manageUrl}</a>
      </p>

      <p style="margin:18px 0 0; font-size:13px; color:#6b7280;">If you need to cancel or reschedule, please reply to this email, call us, or use this confirmation ID with the email or phone from your booking.</p>
    </div>

    <div style="padding:16px 32px; border-top:1px solid #f0e9e6; font-size:13px; color:#6b7280;">
      <div>${BRAND.fullAddress}</div>
      <div style="margin-top:6px">Phone: ${BRAND.phone}</div>
    </div>
  </div>
</div>`.trim();

  return { subject, html, text };
}

export async function sendConfirmationEmail(booking: Booking): Promise<boolean> {
  const { subject, text, html } = buildConfirmationEmail(booking);
  return sendEmail(booking.customerEmail, subject, html, text);
}

export function buildOwnerBookingEmail(booking: Booking): { subject: string; html: string; text: string } {
  const subject = `New booking - ${booking.date} ${booking.time}`;
  const confirmationId = formatConfirmationId(booking.id).join(" ");
  const notes = booking.notes?.trim() || "None";
  const text = `
New booking received.

Customer: ${booking.customerName}
Phone: ${booking.customerPhone}
Email: ${booking.customerEmail}
Service: ${booking.serviceName}
Technician: ${booking.technicianName}
Date: ${booking.date}
Time: ${booking.time}
Confirmation ID: ${confirmationId}
Notes: ${notes}
`.trim();

  const html = `
<div style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial; max-width:640px; margin:0 auto; padding:24px; color:#1f2937;">
  <h2 style="margin:0 0 16px; font-size:18px;">New booking received</h2>
  <table style="width:100%; border-collapse:collapse; font-size:14px;">
    <tr><td style="padding:8px 0; color:#6b7280;">Customer</td><td style="padding:8px 0;"><strong>${booking.customerName}</strong></td></tr>
    <tr><td style="padding:8px 0; color:#6b7280;">Phone</td><td style="padding:8px 0;">${booking.customerPhone}</td></tr>
    <tr><td style="padding:8px 0; color:#6b7280;">Email</td><td style="padding:8px 0;">${booking.customerEmail}</td></tr>
    <tr><td style="padding:8px 0; color:#6b7280;">Service</td><td style="padding:8px 0;">${booking.serviceName}</td></tr>
    <tr><td style="padding:8px 0; color:#6b7280;">Technician</td><td style="padding:8px 0;">${booking.technicianName}</td></tr>
    <tr><td style="padding:8px 0; color:#6b7280;">Date</td><td style="padding:8px 0;"><strong>${booking.date}</strong></td></tr>
    <tr><td style="padding:8px 0; color:#6b7280;">Time</td><td style="padding:8px 0;"><strong>${booking.time}</strong></td></tr>
    <tr><td style="padding:8px 0; color:#6b7280;">Confirmation ID</td><td style="padding:8px 0; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">${confirmationId}</td></tr>
    <tr><td style="padding:8px 0; color:#6b7280;">Notes</td><td style="padding:8px 0;">${notes}</td></tr>
  </table>
</div>`.trim();

  return { subject, html, text };
}

export async function sendOwnerBookingEmail(booking: Booking): Promise<boolean> {
  const ownerEmail = process.env.OWNER_BOOKING_EMAIL;
  if (!ownerEmail) return true;

  const { subject, html, text } = buildOwnerBookingEmail(booking);
  return sendEmail(ownerEmail, subject, html, text);
}
