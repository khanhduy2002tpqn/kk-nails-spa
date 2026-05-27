import { NextRequest, NextResponse } from "next/server";
import { SERVICES, TECHNICIANS } from "@/lib/constants";
import { isSlotAvailable } from "@/lib/booking-utils";
import { getBlockedSlots, getBookingById, getBookings, updateBooking } from "@/lib/store";
import { rescheduleSchema } from "@/lib/validation";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
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

    const { date, time, status } = parsed.data;

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

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updated = await updateBooking(id, { status: "cancelled" });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
