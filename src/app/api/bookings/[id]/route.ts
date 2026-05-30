import { NextRequest, NextResponse } from "next/server";
import { isSlotAvailable } from "@/lib/booking-utils";
import { sendConfirmationEmail } from "@/lib/email";
import { getBlockedSlots, getBookingById, getBookings, updateBooking } from "@/lib/store";
import { verifyStaffToken } from "@/lib/staff-auth";
import { rescheduleSchema } from "@/lib/validation";
import type { Booking } from "@/types";

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

function phoneMatches(input: string, stored: string): boolean {
  const inputDigits = normalizePhone(input);
  const storedDigits = normalizePhone(stored);
  if (inputDigits.length < 10 || storedDigits.length < 10) return false;
  return inputDigits.slice(-10) === storedDigits.slice(-10);
}

function contactMatches(booking: Booking, contact: string | null | undefined): boolean {
  const value = contact?.trim();
  if (!value) return false;

  const emailMatches = value.toLowerCase() === booking.customerEmail.trim().toLowerCase();
  return emailMatches || phoneMatches(value, booking.customerPhone);
}

function canManageAsStaff(request: NextRequest): boolean {
  const token = verifyStaffToken(request.headers.get("x-staff-token"));
  return token?.role === "administrator";
}

async function readJsonBody(request: NextRequest): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function unauthorizedResponse() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!canManageAsStaff(request) && !contactMatches(booking, request.nextUrl.searchParams.get("contact"))) {
    return unauthorizedResponse();
  }
  return NextResponse.json(booking);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = await getBookingById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await request.json();
    const parsed = rescheduleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { date, time, status, contact } = parsed.data;

    if (!canManageAsStaff(request) && !contactMatches(existing, contact)) {
      return unauthorizedResponse();
    }

    if (status === "cancelled") {
      const updated = await updateBooking(id, { status: "cancelled" });
      return NextResponse.json(updated);
    }

    const newDate = date ?? existing.date;
    const newTime = time ?? existing.time;

    if (date || time) {
      const [bookings, blocked] = await Promise.all([getBookings(), getBlockedSlots()]);
      const others = bookings.filter((b) => b.id !== id && b.status === "confirmed");

      if (
        !isSlotAvailable(
          newDate,
          newTime,
          existing.duration,
          existing.technicianId,
          others,
          blocked
        )
      ) {
        return NextResponse.json({ error: "Slot unavailable" }, { status: 409 });
      }
    }

    const updated = await updateBooking(id, {
      ...(date && { date }),
      ...(time && { time }),
      ...(status && { status }),
    });

    if (updated && (date || time) && updated.status === "confirmed") {
      await sendConfirmationEmail(updated);
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = await getBookingById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await readJsonBody(request);
  const contact = typeof body.contact === "string" ? body.contact : request.nextUrl.searchParams.get("contact");
  if (!canManageAsStaff(request) && !contactMatches(existing, contact)) {
    return unauthorizedResponse();
  }

  const updated = await updateBooking(id, { status: "cancelled" });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
