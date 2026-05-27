import { NextRequest, NextResponse } from "next/server";
import { SERVICES, TECHNICIANS } from "@/lib/constants";
import { isSlotAvailable } from "@/lib/booking-utils";
import { sendConfirmationEmail } from "@/lib/email";
import { getBlockedSlots, getBookings, saveBooking, seedSampleData } from "@/lib/store";
import { bookingSchema } from "@/lib/validation";

export async function GET() {
  await seedSampleData();
  const bookings = await getBookings();
  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid booking data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const service = SERVICES.find((s) => s.id === data.serviceId);
    const technician = TECHNICIANS.find((t) => t.id === data.technicianId);

    if (!service || !technician?.active) {
      return NextResponse.json({ error: "Invalid service or technician" }, { status: 400 });
    }

    const [bookings, blocked] = await Promise.all([getBookings(), getBlockedSlots()]);

    if (
      !isSlotAvailable(
        data.date,
        data.time,
        service.duration,
        data.technicianId,
        bookings,
        blocked
      )
    ) {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please choose another." },
        { status: 409 }
      );
    }

    const booking = await saveBooking({
      serviceId: service.id,
      serviceName: service.name,
      technicianId: technician.id,
      technicianName: technician.name,
      date: data.date,
      time: data.time,
      duration: service.duration,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      notes: data.notes,
      status: "confirmed",
    });

    await sendConfirmationEmail(booking);

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
